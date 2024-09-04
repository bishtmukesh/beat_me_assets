import React, { useState, useCallback, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
//import PropTypes from 'prop-types';
import './index.css';

import Lock from '../Lock';
import UserIcon from '../UserIcon';
import Loader from '../Loader';
import Prompt from '../Prompt';
import { GAME_ROOM_URL } from '../../constant/url';
import { generateRoomCodeApi } from '../../api/room';
import { MAX_USERNAME_LENGTH, MEETARENA_USERNAME, ROOM_CODE_LENGTH } from '../../constant/room';

const RoomOptions = () => {
  
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [isRoomPrivate, setIsRoomPrivate] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [selectedIconNumber, setSelectedIconNumber] = useState(1);

    useEffect(() => {
        const storedUserName = localStorage.getItem(MEETARENA_USERNAME);

        if (storedUserName) {
            setUserName(storedUserName.slice(0, MAX_USERNAME_LENGTH));
        }
    }, []);


    const handleUserNameChange = useCallback((event) => {
        setUserName(event.target.value);
        localStorage.setItem(MEETARENA_USERNAME, event.target.value);
    }, []);


    const handleRoomCodeInput = useCallback((event) => {
        const enteredCode = event.target.value;
        const filteredCode = enteredCode.replace(/[^a-zA-Z]/g, '').toUpperCase();
        setRoomCode(filteredCode);
    }, []);

    const validateRoomCodeInput = useCallback(() => {
        if (typeof roomCode === 'string') {
            console.log("Is string");
            return roomCode.length === 4;
        } else {
            console.log("Not a string");
            return false;
        }
    }, [roomCode]);

    const handleJoinRoom = useCallback(() => {
        console.log("Trying to join the room - " + roomCode);
        navigate(GAME_ROOM_URL + `/${roomCode}`, { state: { roomParams: { roomCode, userName, selectedIconNumber, initiatRoomCreation : false } } });
    }, [roomCode, userName, navigate, selectedIconNumber]);

    const handleCreateRoom = useCallback( async () => {
        try {
            console.log("Trying to create a room. Private - " + isRoomPrivate);
            
            setLoading(true);
            const generateRoomCode = await generateRoomCodeApi();
    
            console.log("Generate room code is - " + generateRoomCode);
    
            navigate(GAME_ROOM_URL + `/${generateRoomCode}`, { state: { roomParams: { roomCode : generateRoomCode, userName, selectedIconNumber, isRoomPrivate, initiatRoomCreation : true } } });
        } catch (error) {
            setLoading(false);
            setShowError(true);
            console.error("Got an error - ", error);
        }
    }, [isRoomPrivate, navigate, userName, selectedIconNumber]);

    return (
        <>
            <Loader
                loading={loading} 
            />

            <Prompt
                open={showError}
                setOpen={setShowError}
            />

            <Container className="roomOptions">
                <TextField
                    id="input-with-icon-textfield"
                    label="Nickname"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <UserIcon
                                    selectedIconNumber={selectedIconNumber}
                                    setSelectedIconNumber={setSelectedIconNumber}
                                    width={65}
                                    height={65} 
                                    allowSelection={true}
                                />
                            </InputAdornment>
                        ),
                    }}
                    variant="standard"
                    value={userName}
                    onChange={handleUserNameChange}
                    inputProps={{maxLength: MAX_USERNAME_LENGTH}}
                    sx={{
                        '& .MuiInputBase-root': {
                            height: '75px',
                            fontSize: '30px'
                        }
                    }}
                />

                <Box mt={6}>
                    <Grid container alignItems="center">
                        <Grid item xs={5.5}>
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <Button variant="outlined" size='large' color='success' onClick={handleCreateRoom}>Create Room</Button>
                                <Lock
                                    isRoomPrivate={isRoomPrivate}
                                    setIsRoomPrivate={setIsRoomPrivate} 
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={1}>
                            <Divider orientation="vertical" flexItem />
                        </Grid>
                        
                        <Grid item xs={5.5}>
                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="left" height="100%">
                                
                                <Box display="flex" alignItems="center" marginBottom="10px">
                                    <Typography variant="h6" gutterBottom>
                                        Join an existing room
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="center">
                                    <TextField 
                                        id="outlined-basic" 
                                        label="Enter room code" 
                                        variant="outlined" 
                                        value={roomCode}
                                        onChange={handleRoomCodeInput}
                                        inputProps={{maxLength: ROOM_CODE_LENGTH}}
                                    />
                                    <Button id="m" variant="contained" size="large" disabled={!validateRoomCodeInput()} onClick={handleJoinRoom}>Join Room</Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}

// RoomOptions.propTypes = {

// };

export default RoomOptions;