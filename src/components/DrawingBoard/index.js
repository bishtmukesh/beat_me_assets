import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import PropTypes from 'prop-types';

import './index.css';
import useDrawingBoard from './useDrawingBoard';
import DrawingControls from '../DrawingControls';
import { TOOL_TYPES } from '../../constant/drawingBoard';
import { PICTIONARY_UPDATE_TYPES } from '../../constant/pictionary';

const DrawingBoard = ({
    width, 
    height, 
    userId,
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
    sendPictionaryUpdateMessage,
    setGameUpdateHandler,
}) => {

    const canvasRef = useRef(null);
    const boxRef = useRef(null);

    const [canvasSize, setCanvasSizse] = useState(100);
    const [guess, setGuess] = useState('');

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
        canDraw,
        wordToDraw,
    } = useDrawingBoard( { canvasSize, canvasRef, userId, segment, lastDrawn, prevStates, updateLastDrawn, updateSegment, endSegment, saveBoardState, 
                           undoDrawing, addFloodFill, deleteDrawing, sendPictionaryUpdateMessage, setGameUpdateHandler } );

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
    }, [canvasRef, boxRef, canDraw]);

    const cursorClass = useMemo(() => {
        if (canDraw) {
            switch (selectedTool) {
                case TOOL_TYPES.PENCIL:
                    return 'pencilCursor';
                case TOOL_TYPES.FLOOD_FILL:
                    return 'fillCursor';
                default:
                    return 'defaultCursor';
            }
        } else {
            return 'defaultCursor';
        }
    }, [selectedTool, canDraw]);

    const handleGuess = useCallback(() => {
        console.log("User guesses -> " + guess);
        
        sendPictionaryUpdateMessage({ updateType : PICTIONARY_UPDATE_TYPES.GUESS_WORD, guessedWord : guess });
        setGuess('');
    }, [guess, setGuess, sendPictionaryUpdateMessage]);

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
                paddingTop: '30px',
                paddingBottom: '30px',
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

            {canDraw && ( 
                <>
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
                    Draw - {wordToDraw}
                </>
            )}

            {!canDraw && (
                <Box
                    sx={{
                        marginTop: '10px',
                        width: `${canvasSize}px`,
                        display: 'flex',
                        gap: 2,
                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="Enter your guess"
                        value={guess}
                        onChange={(event) => setGuess(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleGuess();
                            }
                        }}

                        sx={{
                            flex: '1',
                        }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        onClick={handleGuess}
                    >
                        Guess
                    </Button>

                </Box>
            )}

        </Box>
    );
}

DrawingBoard.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    userId: PropTypes.string.isRequired,
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
    sendPictionaryUpdateMessage: PropTypes.func.isRequired,
    setGameUpdateHandler: PropTypes.func.isRequired,
};

export default DrawingBoard;