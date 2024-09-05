import React, { useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FormatColorFillOutlinedIcon from '@mui/icons-material/FormatColorFillOutlined';
import CreateIcon from '@mui/icons-material/Create';
import PropTypes from 'prop-types';

import './index.css';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import { TOOL_TYPES } from '../../constant/drawingBoard';

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
        setSelectedTool(TOOL_TYPES.FLOOD_FILL);
    }, [setSelectedTool]);

    const handlePencilSelect = useCallback(() => {
        setSelectedTool(TOOL_TYPES.PENCIL);
    }, [setSelectedTool]);

    return (
        <Box width={width}>
            <Grid container spacing={1} alignItems='center'>
                <Grid item xs={4}>
                    <SizeSelector 
                        pencilSize={pencilSize}
                        setPencilSize={setPencilSize}
                    />
                </Grid>

                <Grid item xs={2}>
                    <Box 
                        sx={{
                            padding: '0 20px',
                            marginTop: '10px',
                        }}
                    >
                        <IconButton 
                            aria-label="Pencil" 
                            onClick={handlePencilSelect}
                            sx={{
                                border: '1px solid black',        
                                backgroundColor: selectedTool === TOOL_TYPES.PENCIL ? '#f9f614' : 'white',
                                padding: '10px',           
                                borderRadius: '8px', 
                                '&:hover': {
                                    backgroundColor: selectedTool === TOOL_TYPES.PENCIL ? '#f9f614' : 'white'
                                }       
                            }}
                        >   
                            <CreateIcon />
                        </IconButton>
                    </Box>
                </Grid>

                <Grid item xs={2}>
                    <Box 
                        sx={{
                            padding: '0 20px',
                            marginTop: '10px',
                        }}
                    >
                        <IconButton 
                            aria-label="Fill" 
                            onClick={handleFloodFillSelect}
                            sx={{
                                border: '1px solid black',        
                                backgroundColor: selectedTool === TOOL_TYPES.FLOOD_FILL ? '#f9f614' : 'white',
                                padding: '10px',           
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: selectedTool === TOOL_TYPES.FLOOD_FILL ? '#f9f614' : 'white'
                                }      
                            }}
                        >
                            <FormatColorFillOutlinedIcon />
                        </IconButton>
                    </Box>
                </Grid>

                <Grid item xs={2}>
                    <Box 
                        sx={{
                            padding: '0 20px',
                            marginTop: '10px',
                        }}
                    >
                        <IconButton 
                            aria-label="Undo" 
                            onClick={handleUndo}
                            sx={{
                                border: '1px solid black',        
                                padding: '10px',           
                                borderRadius: '8px',        
                            }}
                        >
                            <ReplayIcon />
                        </IconButton>
                    </Box>
                </Grid>

                <Grid item xs={2}>
                    <Box 
                        sx={{
                            padding: '0 20px',
                            marginTop: '10px',
                        }}
                    >
                        <IconButton 
                            aria-label="Clear" 
                            onClick={handleDelete}
                            sx={{
                                border: '1px solid black',        
                                padding: '10px',           
                                borderRadius: '8px',        
                            }}
                        >
                            <DeleteOutlineOutlinedIcon />
                        </IconButton>
                    </Box>
                </Grid>
                
            </Grid>
            
            <ColorSelector
                drawingColor={drawingColor}
                setDrawingColor={setDrawingColor} 
            />
        </Box>
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