import React, {useCallback} from 'react';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FormatColorFillOutlinedIcon from '@mui/icons-material/FormatColorFillOutlined';
import PropTypes from 'prop-types';

import './index.css';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import { DEFAULT_TOOL, TOOL_TYPES } from '../../constant/drawingBoard';

const DrawingControls = ( { 
    width, 
    height, 
    handleUndo, 
    handleDelete, 
    pencilSize, 
    setPencilSize,
    drawingColor,
    setDrawingColor,
    selectedTool,
    setSelectedTool,
}) => {
  
    const handleFloodFillSelect = useCallback(() => {
        if (selectedTool === TOOL_TYPES.FLOOD_FILL) {
            setSelectedTool(DEFAULT_TOOL);
        } else {
            setSelectedTool(TOOL_TYPES.FLOOD_FILL);
        }
    }, [selectedTool, setSelectedTool]);

    return (
        <Container>
            <Box width={width}>
                <Grid container spacing={2}>
                    <Grid item xs={5}>
                        <ColorSelector
                            drawingColor={drawingColor}
                            setDrawingColor={setDrawingColor} 
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <SizeSelector 
                            pencilSize={pencilSize}
                            setPencilSize={setPencilSize}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton aria-label="Fill" color={ selectedTool === TOOL_TYPES.FLOOD_FILL ? 'primary' : 'secondary' } onClick={handleFloodFillSelect}>
                            <FormatColorFillOutlinedIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton aria-label="Undo" onClick={handleUndo}>
                            <ArrowBackOutlinedIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton aria-label="Clear" onClick={handleDelete}>
                            <DeleteOutlineOutlinedIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

DrawingControls.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    pencilSize: PropTypes.number.isRequired,
    drawingColor: PropTypes.string.isRequired,
    handleUndo: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    setPencilSize: PropTypes.func.isRequired,
    setDrawingColor: PropTypes.func.isRequired,
};

export default DrawingControls;