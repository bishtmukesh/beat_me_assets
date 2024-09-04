import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

import './index.css';

const Lock = ( { isRoomPrivate, setIsRoomPrivate } ) => {

  const toggleLock = () => {
    setIsRoomPrivate(!isRoomPrivate);
  };

  return (
    <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        sx={{ 
            borderRadius: '20px', 
            border: '2px solid', 
            borderColor: isRoomPrivate ? 'var(--locked-color)' : 'var(--unlocked-color)', 
            padding: '10px 20px',
            cursor: 'pointer',
            marginLeft: '20px',
            height: '80px',
            width: '200px'
        }}
        onClick={toggleLock}
    >
        <span className={`lock ${isRoomPrivate ? '' : 'unlocked'}`}></span>
        <Box ml={2} fontWeight="bold">
            {isRoomPrivate ? 'Private' : 'Public'}
        </Box>
    </Box>
  );
};

Lock.propTypes = {
    isRoomPrivate: PropTypes.bool.isRequired,
    setIsRoomPrivate: PropTypes.func.isRequired,
};

export default Lock;