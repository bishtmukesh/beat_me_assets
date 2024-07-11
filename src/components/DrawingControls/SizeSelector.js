import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import PropTypes from 'prop-types';

import './index.css';
import { DEFAULT_PENCIL_SIZE, MINIMUM_PENCIL_SIZE, MAXIMUM_PENCIL_SIZE } from '../../constant/drawingBoard';

const SizeSelector = ( { pencilSize, setPencilSize } ) => {

    const handleChange = (event, newSize) => {
        setPencilSize(newSize);
    };

    return (
        <Box>
            <Slider 
                aria-label="Size" 
                value={pencilSize} 
                onChange={handleChange} 
                defaultValue={DEFAULT_PENCIL_SIZE}
                min={MINIMUM_PENCIL_SIZE} 
                max={MAXIMUM_PENCIL_SIZE}
            />
        </Box>
    );
}

SizeSelector.propTypes = {
    pencilSize: PropTypes.number.isRequired,
    setPencilSize: PropTypes.func.isRequired,
};

export default SizeSelector;