import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import './index.css';
import useDrawingBoard from './useDrawingBoard';
import DrawingControls from '../DrawingControls';

const DrawingBoard = ({
    width, 
    height, 
    drawing,
    segment,
    lastDrawn,
    updateLastDrawn,
    updateSegment,
    endSegment,
    addFloodFill,
    removeLastSegment,
    deleteDrawing,
    canDraw,
    sendPictionaryUpdateMessage,
    setGameUpdateHandler,
}) => {

    const canvasRef = useRef(null);

    useEffect(() => {
        deleteDrawing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleUndo,
        handleDelete,
        pencilSize,
        setPencilSize,
        drawingColor,
        setDrawingColor,
        selectedTool,
        setSelectedTool,
    } = useDrawingBoard( { width, height, canvasRef, drawing, segment, lastDrawn, updateLastDrawn, updateSegment, 
                           endSegment, addFloodFill, removeLastSegment, deleteDrawing, canDraw, sendPictionaryUpdateMessage, setGameUpdateHandler } );

    return (
        <Container>
            <canvas 
                id="drawingBoard" 
                ref={canvasRef}
                width={width} 
                height={height} 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />

            <DrawingControls 
                width={width}
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
        </Container>
    );
}

DrawingBoard.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    drawing: PropTypes.array.isRequired, 
    segment: PropTypes.array.isRequired,
    lastDrawn: PropTypes.number.isRequired, 
    updateLastDrawn: PropTypes.func.isRequired,
    updateSegment: PropTypes.func.isRequired,
    endSegment: PropTypes.func.isRequired,
    addFloodFill: PropTypes.func.isRequired,
    removeLastSegment: PropTypes.func.isRequired,
    deleteDrawing: PropTypes.func.isRequired,
    canDraw: PropTypes.bool.isRequired,
    sendPictionaryUpdateMessage: PropTypes.func.isRequired,
    setGameUpdateHandler: PropTypes.func.isRequired,
};

export default DrawingBoard;