import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';

import './index.css';
import { COLOR_SELECTOR_BOX_HEIGHT, COLOR_SELECTOR_BOX_WIDTH, drawingColors } from '../../constant/drawingBoard';


const ColorBox = ({ color, setDrawingColor }) => {
    
    const handleColorChange = (event) => {
        setDrawingColor(color);
    };
    
    return (
        <Box sx={{ 
                backgroundColor: color, 
                height: COLOR_SELECTOR_BOX_HEIGHT,
                width: COLOR_SELECTOR_BOX_WIDTH, 
                cursor: 'pointer',
                border: '1px solid black',
                borderRadius: '50%',
            }} 
            onClick={handleColorChange}
        />
    );
};

const ColorSelector = ( { drawingColor, setDrawingColor } ) => {
  
    return (
        <Box 
            sx={{ 
                padding: 2, 
                border: '2px solid grey',
                borderRadius: '10px',
                marginTop: '10px',
            }}
        >
            <Grid container spacing={2}>
                {drawingColors.map((color, index) => (
                    <Grid key={index} item xs={1}>
                        <ColorBox
                            color={color}
                            setDrawingColor={setDrawingColor}
                        />
                    </Grid>
                ))}

                <Grid item xs={2}></Grid>
                <Grid item xs={2}>
                    <ColorBox
                        color={drawingColor}
                        setDrawingColor={setDrawingColor}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

ColorSelector.propTypes = {
    drawingColor: PropTypes.string.isRequired,
    setDrawingColor: PropTypes.func.isRequired,
};

export default ColorSelector;