import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Typography from '@mui/material/Typography';
//import PropTypes from 'prop-types';

import './index.css';
import useRoom from './useRoom';
import { UNKNOWN_USERNAME } from '../../constant/room';
import ChatHandler from '../../components/ChatHandler';
import GameManager from '../../components/GameManager';

const Room = () => {
  
    const location = useLocation();
    const { roomParams } = location.state || {}; 
    const { roomCodeFromURL } = useParams();
    
    const [games, setGames] = useState(['Game 1', 'Game 2', 'Game 3']);
    const [selectedGame, setSelectedGame] = useState(''); 
    const [roomCode, setRoomCode] = useState(roomParams?.roomCode || roomCodeFromURL);

    const {
        connected,
        subscribed,
        userId,
        hostUserId,
        isHost,
        sendMessage,
        players,
        stompClient,
        setGameUpdateHandler,
    } = useRoom( {roomCode, userName : roomParams?.userName || '', selectedIconNumber : roomParams?.selectedIconNumber || 1} );

    return (
        <Container className="room">
            {connected && subscribed && (
                <Grid container spacing={2}>

                    <Grid item xs={4}>
                        <Box 
                            sx={{ 
                                backgroundColor: 'white', 
                                height: '100%', 
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2
                            }}
                        >
                            <Paper style={{ marginTop: '20px', height: '50%', width: '90%', border: '1px solid black'}}>
                                <Typography variant="h6">Players</Typography>
                                <List>
                                    {players
                                        .sort((a, b) => (a.userId === userId ? -1 : b.userId === userId ? 1 : 0))
                                        .map((player, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={player.userName || UNKNOWN_USERNAME} />
                                                {hostUserId === player.userId && <AssignmentIndIcon />}
                                            </ListItem>
                                        ))}
                                </List>
                            </Paper>

                            <Box sx={{ height: '50%', width: '90%', marginBottom: '20px' }}>
                                <ChatHandler
                                    sendMessage={sendMessage}
                                    userId={userId}
                                />
                            </Box>

                        </Box>
                    </Grid>
                    
                    <Grid item xs={8}>
                        <GameManager 
                            roomCode={roomCode}
                            isHost={isHost}
                            stompClient={stompClient}
                            setGameUpdateHandler={setGameUpdateHandler}
                        />
                    </Grid>                

                </Grid>
            )}
        </Container>
    );
}

// Room.propTypes = {

// };

export default Room;
