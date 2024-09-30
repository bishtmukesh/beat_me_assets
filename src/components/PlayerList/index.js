import React from 'react';
import { MdPerson } from 'react-icons/md';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';

import { UNKNOWN_USERNAME } from '../../constant/room';
import UserIcon from '../../components/UserIcon';

const PlayerList = ( { players, userId, hostUserId } ) => {

    return (
        <Paper 
            sx={{ 
                marginTop: '20px',
                marginBottom: '20px', 
                height: '100%', 
                width: '90%', 
                border: '2px solid black',
                borderRadius: '15px',
                overflow: 'scroll',
                '&::-webkit-scrollbar': { // WebKit (e.g., Chrome, Safari).
                    display: 'none',
                },
                '-ms-overflow-style': 'none',  // Hide scrollbar in IE and Edge
                'scrollbar-width': 'none', // firefox
            }}
        >
            <List
                sx={{
                    padding: '0px',
                }} 
            >
                {players
                    .sort((a, b) => {
                        if (a.userId === userId) return -1;
                        if (b.userId === userId) return 1;

                        if (a.userId === hostUserId) return -1; 
                        if (b.userId === hostUserId) return 1;

                        return 0;
                    })
                    .map((player, index) => (

                        <ListItem 
                            key={index}
                            sx={{
                                backgroundColor: index % 2 === 0 ? '#ffffff' : '#c7c5bf',
                                border: '1px solid black',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: index % 2 === 0 ? '#e0e0e0' : '#c7c5bf',
                                },
                            }}
                        >
                            {player.selectedIconNumber && 
                                <UserIcon
                                    selectedIconNumber={player.selectedIconNumber}
                                    setSelectedIconNumber={null}
                                    width={50}
                                    height={50}
                                    allowSelection={false}
                                />
                            }
                            <ListItemText sx={{ paddingLeft: '5px' }} primary={player.userName || UNKNOWN_USERNAME} />
                            {hostUserId === player.userId && <MdPerson size={35} color="black" />}
                        </ListItem>
                    ))}
            </List>
        </Paper>
    );
}

PlayerList.propTypes = {
    players: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
    hostUserId: PropTypes.string.isRequired,
};

export default PlayerList;
