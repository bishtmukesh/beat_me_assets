import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { DEFAULT_DRAWING_COLOR, DEFAULT_PENCIL_SIZE, DEFAULT_TOOL, DRAWING_UPDATE_TYPES, 
         LINE_CAP, LINE_JOIN, MAXIMUM_PENCIL_SIZE, MINIMUM_PENCIL_SIZE, TOOL_TYPES } from '../../constant/drawingBoard';
import { MESSAGE_TYPES } from '../../constant/room';
import useFloodFill from './useFloodFill';
 
const useDrawingBoard = ({ 
    width, 
    height, 
    canvasRef,
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
    
    const [selectedTool, setSelectedTool] = useState(DEFAULT_TOOL);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [pencilSize, setPencilSize] = useState(DEFAULT_PENCIL_SIZE);
    const [drawingColor, setDrawingColor] = useState(DEFAULT_DRAWING_COLOR);

    const [networkPencilSize, setNetworkPencilSize] = useState(DEFAULT_PENCIL_SIZE);
    const [networkDrawingColor, setNetworkDrawingColor] = useState(DEFAULT_DRAWING_COLOR);

    const {
        floodFill,
        quickFill,
    } = useFloodFill({ canvasRef });

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
    }, [drawing, segment, lastDrawn, updateLastDrawn, updateSegment, endSegment, 
        pencilSize, drawingColor, canvasRef, canDraw, networkDrawingColor, 
        networkPencilSize]);

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsMouseDown(false);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [endSegment]);

    const undo = useCallback(() => {
        if (canvasRef.current !== null) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0,canvas.width, canvas.height);
            ctx.lineJoin = LINE_JOIN;
            ctx.lineCap = LINE_CAP;

            drawing.forEach((segment, index) => {
                if (index !== drawing.length - 1) {
                    if (segment.tool === TOOL_TYPES.PENCIL) {
                        ctx.strokeStyle = segment.drawingColor;
                        ctx.lineWidth = segment.pencilSize;
                        ctx.beginPath();

                        const points = segment.points;
                        for (let i = 0; i < points.length; i++) {
                            if (i !== 0) {
                                drawLine(ctx, points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
                            } else {
                                drawLine(ctx, points[i].x, points[i].y, points[i].x, points[i].y);
                            }
                        }
                    } else if (segment.tool === TOOL_TYPES.FLOOD_FILL){
                        quickFill(segment.startPoint, segment.drawingColor);
                    }
                }
            });

            removeLastSegment();
        }
    }, [drawing, canvasRef, removeLastSegment, quickFill]);

    const handleUndo = useCallback(() => {
        if (canDraw) {
            undo();
            sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.UNDO);
        }
    }, [undo, sendPictionaryUpdateMessage, canDraw]);

    const handleDelete = useCallback(() => {
        if (canvasRef.current !== null && canDraw) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0,canvas.width, canvas.height);
            deleteDrawing();

            sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.DELETE);
        }
    }, [deleteDrawing, canvasRef, sendPictionaryUpdateMessage, canDraw]);

    
    const handleMouseDown = (event) => {
        event.preventDefault();
        setIsMouseDown(true);

        if (!canDraw) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        setPosition({ x, y });
        if (selectedTool === TOOL_TYPES.PENCIL) {
            updateSegment({x, y});
            sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.ADD_TO_SEGMENT, {x, y}, drawingColor, pencilSize);
        } else if (selectedTool === TOOL_TYPES.FLOOD_FILL) {
            addFloodFill({startPoint : {x, y}, drawingColor});
            quickFill({x, y}, drawingColor);
            sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.ADD_FLOOD_FILL, {x, y}, drawingColor);
        }
    };

    const handleMouseMove = (event) => {
        event.preventDefault();

        if (!canDraw) return;
        
        if (isMouseDown && selectedTool === TOOL_TYPES.PENCIL) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            setPosition({ x, y });
            updateSegment(position);
            sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.ADD_TO_SEGMENT, position);
        }
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);

        if (!canDraw) return;

        if (selectedTool === TOOL_TYPES.PENCIL) {
            endSegment({pencilSize, drawingColor});
            sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.END_SEGMENT);
        }
    };

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
                    deleteDrawing();
                }
            } else if (message.updateType === DRAWING_UPDATE_TYPES.UNDO) {
                console.log("Calling undo");
                undo();
            } else if (message.updateType === DRAWING_UPDATE_TYPES.ADD_TO_SEGMENT) {
                const point = message.point;
                if (point && point.x && point.y) {
                    updateSegment(point);
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
            } else if (message.updateType === DRAWING_UPDATE_TYPES.ADD_FLOOD_FILL) {
                const point = message.point;
                const fillColor = message.drawingColor;
                if (point && point.x && point.y) {
                    addFloodFill({startPoint : point, drawingColor: fillColor});
                    floodFill(point, fillColor);
                }
            }
        }
    }, [deleteDrawing, canvasRef, endSegment, undo, updateSegment, networkDrawingColor, networkPencilSize, addFloodFill, floodFill]);

    setGameUpdateHandler(handleGameUpdate);

    return {
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
    };
}

useDrawingBoard.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    canvasRef: PropTypes.shape({
        current: PropTypes.instanceOf(Element)
    }),
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

export default useDrawingBoard;