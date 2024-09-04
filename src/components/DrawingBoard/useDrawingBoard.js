import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { DEFAULT_DRAWING_COLOR, DEFAULT_PENCIL_SIZE, DEFAULT_TOOL, DRAWING_UPDATE_TYPES, LINE_CAP, LINE_JOIN, MAXIMUM_PENCIL_SIZE, MINIMUM_PENCIL_SIZE, TOOL_TYPES } from '../../constant/drawingBoard';
import { MESSAGE_TYPES } from '../../constant/room';
 
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

    const floodFill = useCallback((startPoint, fillColor) => {
        if (canvasRef.current !== null) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            const width = canvas.width;
            const height = canvas.height;

            const startX = Math.round(startPoint.x);
            const startY = Math.round(startPoint.y);

            console.log("Calling flood fill for -> " + startX + ", " + startY);

            const stack = [[startX, startY]]; 
            const startColor = getColorAtPixel(data, startX, startY, width);

            if (colorsMatch(startColor, hexToRgba(fillColor))) return;

            const visited = new Uint8Array(width * height);

            const directions = [
                [-1, 0], [1, 0],
                [0, -1], [0, 1]  
            ];

            while (stack.length > 0) {
                const [px, py] = stack.pop();
                const index = py * width + px;

                if (!visited[index]) {
                    visited[index] = 1;
                    const currentColor = getColorAtPixel(data, px, py, width);

                    if (colorsMatch(currentColor, startColor)) {
                        setColorAtPixel(data, px, py, hexToRgba(fillColor), width);

                        for (const [dx, dy] of directions) {
                            const nx = px + dx;
                            const ny = py + dy;
                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                stack.push([nx, ny]);
                            }
                        }
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
        }
    }, [canvasRef]);

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
                        floodFill(segment.startPoint, segment.drawingColor);
                    }
                }
            });

            removeLastSegment();
        }
    }, [drawing, canvasRef, removeLastSegment, floodFill]);

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
            floodFill({x, y}, drawingColor);
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

    function getColorAtPixel(data, x, y, width) {
        const index = (y * width + x) * 4;
        return [data[index], data[index + 1], data[index + 2], data[index + 3]];
    }
    
    function setColorAtPixel(data, x, y, color, width) {
        const index = (y * width + x) * 4;
        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = color[3];
    }
    
    function colorsMatch(color1, color2) {
        return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2] && color1[3] === color2[3];
    }

    function hexToRgba(hex) {
        let r = 0, g = 0, b = 0, a = 255;
        
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    
        return [r, g, b, a];
    }

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
                    console.log("Calling floow fill with values -> " + point.x + ", " + point.y + " and color -> " + fillColor);
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