import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { DEFAULT_DRAWING_COLOR, DEFAULT_PENCIL_SIZE, DEFAULT_TOOL, DRAWING_UPDATE_TYPES, 
         LINE_CAP, LINE_JOIN, MAXIMUM_PENCIL_SIZE, MINIMUM_PENCIL_SIZE } from '../../constant/drawingBoard';
import { MESSAGE_TYPES } from '../../constant/room';
import useMouseEvents from './useMouseEvents';
import useFloodFill from './useFloodFill';
import { scalePoint } from '../../utils/scale';
 
const useDrawingBoard = ({ 
    canvasSize,
    canvasRef,
    userId,
    lastDrawn,
    segment,
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
    
    const [selectedTool, setSelectedTool] = useState(DEFAULT_TOOL);
    const [pencilSize, setPencilSize] = useState(DEFAULT_PENCIL_SIZE);
    const [drawingColor, setDrawingColor] = useState(DEFAULT_DRAWING_COLOR);

    const [networkPencilSize, setNetworkPencilSize] = useState(DEFAULT_PENCIL_SIZE);
    const [networkDrawingColor, setNetworkDrawingColor] = useState(DEFAULT_DRAWING_COLOR);

    const [userToDraw, setUserToDraw] = useState(null);

    const canDraw = useMemo(() => {
        return userToDraw ? userToDraw === userId ? true : false : false;
    }, [userToDraw]);

    const getImageData = useCallback(() => {
        if (canvasRef.current !== null) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const width = canvas.width;
            const height = canvas.height;

            return ctx.getImageData(0, 0, width, height);
        } else {
            return null;
        }
    }, [canvasRef]);

    const {
        quickFill,
    } = useFloodFill({ canvasRef });

    const {
        handleMouseMove,
        handleMouseEnter,
        handleMouseDown,
        handleMouseUp,
    } = useMouseEvents({ canvasSize, canvasRef, canDraw, selectedTool, pencilSize, drawingColor, updateSegment, endSegment, saveBoardState, 
                         quickFill, addFloodFill, getImageData, sendPictionaryUpdateMessage });

    useEffect(() => {
        if (canvasRef.current !== null) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
 
            ctx.beginPath();
            ctx.lineJoin = LINE_JOIN;
            ctx.lineCap = LINE_CAP;

            const strokeStyle = canDraw ? drawingColor : networkDrawingColor;
            const lineWidth = canDraw ? pencilSize : networkPencilSize;

            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;

            let len = segment.length;
            for (let i = lastDrawn + 1; i < len; i++) {
                if (i !== 0) {
                    drawLine(ctx, segment[i - 1].x, segment[i - 1].y, segment[i].x, segment[i].y);
                } else {
                    drawLine(ctx, segment[i].x, segment[i].y, segment[i].x, segment[i].y);
                }
            }
            updateLastDrawn(len - 1);
        }
    }, [segment, lastDrawn, updateLastDrawn, updateSegment, endSegment, 
        pencilSize, drawingColor, canvasRef, canDraw, networkDrawingColor, 
        networkPencilSize]);

    useEffect(() => {
        if (canvasRef.current !== null) {
            const imageData = getImageData();
            saveBoardState(imageData);
        }
    }, [canvasRef, saveBoardState, getImageData]);

    const undo = useCallback(() => {
        if (canvasRef.current !== null) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (prevStates.length >= 2) {
                const imageData = prevStates[prevStates.length - 2];
                undoDrawing();
                ctx.putImageData(imageData, 0, 0);
            }
        }
    }, [canvasRef, prevStates, undoDrawing]);

    const handleUndo = useCallback(() => {
        if (canDraw) {
            sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.UNDO);
            undo();
        }
    }, [undo, sendPictionaryUpdateMessage, canDraw]);

    const handleDelete = useCallback(() => {
        if (canvasRef.current !== null && canDraw) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0,canvas.width, canvas.height);
            deleteDrawing(ctx.getImageData(0, 0, canvas.width, canvas.height));

            sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.DELETE);
        }
    }, [deleteDrawing, canvasRef, sendPictionaryUpdateMessage, canDraw]);

    const drawLine = (ctx, startX, startY, endX, endY) => {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    };

    const handleGameUpdate = useCallback((message) => {
        if(message.messageType === MESSAGE_TYPES.GAME_UPDATE) {
            if (message.updateType === DRAWING_UPDATE_TYPES.DELETE) {
                if (canvasRef.current !== null) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d");

                    ctx.clearRect(0, 0,canvas.width, canvas.height);
                    deleteDrawing(getImageData());
                }
            } else if (message.updateType === DRAWING_UPDATE_TYPES.UNDO) {
                undo();
            } else if (message.updateType === DRAWING_UPDATE_TYPES.ADD_TO_SEGMENT) {
                const point = message.point;
                if (point && point.x && point.y) {
                    updateSegment(scalePoint(point.x, point.y, canvasSize));
                }

                const color = message.drawingColor;
                const size = message.pencilSize;

                if (color !== null && typeof color === 'string') {
                    setNetworkDrawingColor(color);
                }

                if (Number.isInteger(size) && (size >= MINIMUM_PENCIL_SIZE && size <= MAXIMUM_PENCIL_SIZE)) {
                    setNetworkPencilSize(size);
                }
            } else if (message.updateType === DRAWING_UPDATE_TYPES.END_SEGMENT) {
                endSegment({ pencilSize: networkPencilSize, drawingColor: networkDrawingColor});
                saveBoardState(getImageData());
            } else if (message.updateType === DRAWING_UPDATE_TYPES.ADD_FLOOD_FILL) {
                const point = message.point;
                const scaledPoint = scalePoint(point.x, point.y, canvasSize);
                const fillColor = message.drawingColor;
                if (point && point.x && point.y) {
                    addFloodFill({startPoint : scaledPoint, drawingColor: fillColor});
                    quickFill(scaledPoint, fillColor);
                    saveBoardState(getImageData());
                }
            } else if (message.updateType === DRAWING_UPDATE_TYPES.ALLOW_DRAW) {
                if (message.userToDraw) {
                    setUserToDraw(message.userToDraw);
                }
            }
        }
    }, [, canvasRef, canvasSize, deleteDrawing, endSegment, undo, updateSegment, networkDrawingColor, networkPencilSize, addFloodFill, quickFill, saveBoardState, getImageData]);

    setGameUpdateHandler(handleGameUpdate);

    return {
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
    };
}

useDrawingBoard.propTypes = {
    canvasSize: PropTypes.number.isRequired,
    canvasRef: PropTypes.shape({
        current: PropTypes.instanceOf(Element)
    }),
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

export default useDrawingBoard;