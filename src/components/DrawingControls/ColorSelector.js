import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';

import './index.css';
import { COLOR_SELECTOR_BOX_WIDTH, drawingColors } from '../../constant/drawingBoard';


const ColorBox = ({ color, setDrawingColor }) => {
    
    const handleColorChange = (event) => {
        setDrawingColor(color);
    };
    
    return (
        <Box sx={{ 
                backgroundColor: color, 
                width: 'auto', 
                height: COLOR_SELECTOR_BOX_WIDTH,
                cursor: 'pointer',
                border: '2px solid black',
            }} 
            onClick={handleColorChange}
        />
    );
};

const ColorSelector = ( { drawingColor, setDrawingColor } ) => {
  
    return (
        <Box sx={{ p: 2, border: '1px solid grey' }}>
            <Grid container spacing={2}>
                {drawingColors.map((color, index) => (
                    <Grid key={index} item xs={2}>
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