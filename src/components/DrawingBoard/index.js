import React, { useRef, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

import './index.css';
import useDrawingBoard from './useDrawingBoard';
import DrawingControls from '../DrawingControls';
import { TOOL_TYPES } from '../../constant/drawingBoard';

const DrawingBoard = ({
    width, 
    height, 
    segment,
    lastDrawn,
    prevStates,
    updateLastDrawn,
    updateSegment,
    endSegment,
    saveBoardState,
    undoDrawing,
    addFloodFill,
    deleteDrawing,
    canDraw,
    sendPictionaryUpdateMessage,
    setGameUpdateHandler,
}) => {

    const canvasRef = useRef(null);
    const boxRef = useRef(null);

    const [canvasSize, setCanvasSizse] = useState(100);

    useEffect(() => {
        deleteDrawing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (canvasRef.current) {
            const boxWidth = boxRef.current.clientWidth;
            const boxHeight = boxRef.current.clientHeight;

            const width = (boxWidth / 100) * 90;     // 90% width
            const height = (boxHeight / 100) * 70;   // 70% height

            setCanvasSizse(Math.min(width, height));
        }
    }, [canvasRef, boxRef]);

    const {
        handleMouseDown,
        handleMouseMove,
        handleMouseEnter,
        handleMouseUp,
        handleUndo,
        handleDelete,
        pencilSize,
        setPencilSize,
        drawingColor,
        setDrawingColor,
        selectedTool,
        setSelectedTool,
    } = useDrawingBoard( { canvasSize, canvasRef, segment, lastDrawn, prevStates, updateLastDrawn, updateSegment, endSegment, saveBoardState, 
                           undoDrawing, addFloodFill, deleteDrawing, canDraw, sendPictionaryUpdateMessage, setGameUpdateHandler } );

    const cursorClass = useMemo(() => {
        switch (selectedTool) {
            case TOOL_TYPES.PENCIL:
                return 'pencilCursor';
            case TOOL_TYPES.FLOOD_FILL:
                return 'fillCursor';
            default:
                return 'defaultCursor';
        }
    }, [selectedTool]);

    return (
        <Box 
            component="section" 
            ref={boxRef}
            sx={{  
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid black',
            }}
        >
            <canvas 
                className={`drawingBoard ${cursorClass}`}
                ref={canvasRef}
                width={canvasSize}
                height={canvasSize}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
            />

            <DrawingControls 
                width={canvasSize}
                height={height} 
                handleUndo={handleUndo}
                handleDelete={handleDelete}
                pencilSize={pencilSize}
                setPencilSize={setPencilSize}
                drawingColor={drawingColor}
                setDrawingColor={setDrawingColor}
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
            />
        </Box>
    );
}

DrawingBoard.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    segment: PropTypes.array.isRequired,
    lastDrawn: PropTypes.number.isRequired, 
    prevStates: PropTypes.array.isRequired,
    updateLastDrawn: PropTypes.func.isRequired,
    updateSegment: PropTypes.func.isRequired,
    endSegment: PropTypes.func.isRequired,
    saveBoardState: PropTypes.func.isRequired,
    undoDrawing: PropTypes.func.isRequired,
    addFloodFill: PropTypes.func.isRequired,
    deleteDrawing: PropTypes.func.isRequired,
    canDraw: PropTypes.bool.isRequired,
    sendPictionaryUpdateMessage: PropTypes.func.isRequired,
    setGameUpdateHandler: PropTypes.func.isRequired,
};

export default DrawingBoard;