import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

import { PICTIONARY_GAME_STATES} from '../../constant/pictionary';
import { ROOM_UPDATE_TYPES } from '../../constant/room';

const StartOptions = ( { setPictionaryGameState, isHost, sendRoomUpdateMessage } ) => {

    const handleGameStart = () => {
        setPictionaryGameState(PICTIONARY_GAME_STATES.GAME_STARTED);
        sendRoomUpdateMessage(ROOM_UPDATE_TYPES.START);
    }

    return (
        <Box 
            component="section" 
            sx={{  
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Button 
                onClick={handleGameStart} 
                disabled={!isHost}
                startIcon={
                    <PlayArrowIcon 
                        sx={{
                            backgroundColor: 'black',
                            borderRadius: '100%',
                            width: '45px',  
                            height: '45px',
                            marginRight: '5px',
                            padding: '5px',
                        }}
                    />
                }
                sx={{
                    fontSize: '35px',
                    color: 'white',
                    background: 'linear-gradient(0deg, #e55851, #e87a61)',
                    borderRadius: '25px',
                    padding: '10px 30px 10px 20px',
                    fontFamily: 'Arial, sans-serif',
                    textTransform: 'none',
                    transition: 'box-shadow 0.5s ease',
                    
                    '&:hover': {
                        backgroundColor: 'red',
                        boxShadow: '0 4px 25px rgba(229, 88, 81, 0.8)',
                        '& .MuiSvgIcon-root': { 
                            transform: 'scale(1.1)',
                        }
                    }
                }}
            >
                Play
            </Button>

            {!isHost && <Typography variant="h5" sx={{ marginTop: '10px' }}>Waiting for host to start the game</Typography>}
                    
        </Box>
    );
}

StartOptions.propTypes = {
    setPictionaryGameState: PropTypes.func.isRequired,
    isHost: PropTypes.bool.isRequired,
    sendRoomUpdateMessage: PropTypes.func.isRequired,
};

export default StartOptions;