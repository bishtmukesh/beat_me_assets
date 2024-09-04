import React, {useState, useEffect, useRef} from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';

//import './index.css';
import { userIcons } from '../../utils/image';

const UserIcon = ( { selectedIconNumber, setSelectedIconNumber, width, height, allowSelection } ) => {

    const [showIconSelection, setShowIconSelection] = useState(false);

    const ref = useRef(null);

    const handleAvatarClick = () => {
        setShowIconSelection(!showIconSelection);
    };

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setShowIconSelection(false);
        }
    };

    const handleIconSelection = (index) => {
        setSelectedIconNumber(index + 1);
        setShowIconSelection(false);
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Box 
            sx={{ position: 'relative' }}
            ref={ref}
        >
            <Avatar 
                alt="userIcon1" 
                src={userIcons[(selectedIconNumber - 1) % userIcons.length]} 
                sx={{ 
                    width: width, 
                    height: height,
                    border: '2px solid #1976d2',
                    padding: '2px',
                    cursor: 'pointer',
                    '&:hover': {
                        border: '3px solid #1976d2' 
                    }
                }}
                onClick={handleAvatarClick}
            /> 
            {showIconSelection && allowSelection && (
                <Paper 
                    sx={{ 
                        position: 'absolute', 
                        top: '70px',
                        left: '-110px', 
                        padding: '16px', 
                        width: '300px',
                        boxShadow: 3,
                        overflowY: 'auto',
                        maxHeight: '150px',
                        zIndex: '10'
                    }}
                >
                   <Grid container spacing={2}>
                        {userIcons.map((icon, index) => (
                            <Grid key={index} item xs={3}>
                                <Avatar 
                                    alt="userIcon1" 
                                    src={icon} 
                                    sx={{ 
                                        width: 40, 
                                        height: 40,
                                        border: '2px solid #1976d2',
                                        padding: '2px',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            border: '3px solid #1976d2' 
                                        }
                                    }}
                                    onClick={() =>  handleIconSelection(index)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}
        </Box>
    );
};

UserIcon.propTypes = {
    selectedIconNumber: PropTypes.number.isRequired,
    setSelectedIconNumber: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    allowSelection: PropTypes.bool.isRequired,
};

export default UserIcon;