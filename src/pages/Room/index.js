import React, { useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
//import PropTypes from 'prop-types';

import './index.css';
import useRoom from './useRoom';
import ChatHandler from '../../components/ChatHandler';
import GameManager from '../../components/GameManager';
import PlayerList from '../../components/PlayerList';

const Room = () => {
  
    const location = useLocation();
    const { roomParams } = location.state || {}; 
    const { roomCodeFromURL } = useParams();
    
    const [games, setGames] = useState(['Game 1', 'Game 2', 'Game 3']);
    const [selectedGame, setSelectedGame] = useState(''); 
    const [roomCode, setRoomCode] = useState(roomParams?.roomCode || roomCodeFromURL);

    const [addOnComponent1Renderer, setAddOnComponent1Renderer] = useState(null);

    const renderAddOnComponent1 = useCallback(() => {
        if (typeof addOnComponent1Renderer === 'function') {
            return addOnComponent1Renderer();
        } else {
            return null;
        }
    }, [addOnComponent1Renderer]);

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
        setRoomUpdateHandler,
    } = useRoom( {roomCode, userName : roomParams?.userName || '', selectedIconNumber : roomParams?.selectedIconNumber || 1} );

    return (
        <Container className="room">
            {connected && subscribed && (
                <>
                    <Grid container spacing={2}>

                        <Grid item xs={3}>
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
                                <PlayerList
                                    players={players}
                                    userId={userId}
                                    hostUserId={hostUserId}
                                />
                            </Box>
                        </Grid>
                        
                        <Grid item xs={6}>
                            <GameManager 
                                roomCode={roomCode}
                                userId={userId}
                                isHost={isHost}
                                stompClient={stompClient}
                                setGameUpdateHandler={setGameUpdateHandler}
                                setRoomUpdateHandler={setRoomUpdateHandler}
                                setAddOnComponent1Renderer={setAddOnComponent1Renderer}
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <Box sx={{ height: '100%', width: '100%', marginBottom: '20px' }}>
                                <ChatHandler
                                    sendMessage={sendMessage}
                                    userId={userId}
                                />
                            </Box>
                        </Grid>                

                    </Grid>

                    {renderAddOnComponent1()}
                </>
            )}
        </Container>
    );
}

// Room.propTypes = {

// };

export default Room;
