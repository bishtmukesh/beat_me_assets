import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { useStoreState, useStoreActions } from 'easy-peasy';

import './index.css';
import DrawingControls from '../DrawingControls';
import { DEFAULT_DRAWING_COLOR, DEFAULT_PENCIL_SIZE, DEFAULT_TOOL, LINE_CAP, LINE_JOIN, TOOL_TYPES } from '../../constant/drawingBoard';

const DrawingBoard = ( {width, height} ) => {
  
    const drawing = useStoreState(state => state.drawing.drawing);
    const segment = useStoreState(state => state.drawing.segment);
    const lastDrawn = useStoreState(state => state.drawing.lastDrawn);
    const updateLastDrawn = useStoreActions(actions => actions.drawing.updateLastDrawn);
    const updateSegment = useStoreActions(actions => actions.drawing.updateSegment);
    const endSegment = useStoreActions(actions => actions.drawing.endSegment);
    const removeLastSegment = useStoreActions(actions => actions.drawing.removeLastSegment);
    const deleteDrawing = useStoreActions(actions => actions.drawing.deleteDrawing);
    
    const [selectedTool, setSelectedTool] = useState(DEFAULT_TOOL);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [pencilSize, setPencilSize] = useState(DEFAULT_PENCIL_SIZE);
    const [drawingColor, setDrawingColor] = useState(DEFAULT_DRAWING_COLOR);

    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current !== null) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            ctx.beginPath();
            ctx.strokeStyle = drawingColor;
            ctx.lineWidth = pencilSize;
            ctx.lineJoin = LINE_JOIN;
            ctx.lineCap = LINE_CAP;

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
    }, [drawing, segment, lastDrawn, updateLastDrawn, updateSegment, endSegment, pencilSize, drawingColor]);

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsMouseDown(false);
            //endSegment();
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [endSegment]);

    const handleUndo = useCallback(() => {
        if (canvasRef.current !== null) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0,canvas.width, canvas.height);
            ctx.lineJoin = LINE_JOIN;
            ctx.lineCap = LINE_CAP;

            drawing.forEach((segment, index) => {
                ctx.strokeStyle = segment.drawingColor;
                ctx.lineWidth = segment.pencilSize;
                ctx.beginPath();
                if (index !== drawing.length - 1) {
                    const points = segment.points;
                    for (let i = 0; i < points.length; i++) {
                        if (i !== 0) {
                            drawLine(ctx, points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
                        } else {
                            drawLine(ctx, points[i].x, points[i].y, points[i].x, points[i].y);
                        }
                    }
                }
            });

            removeLastSegment();
        }
    }, [removeLastSegment, drawing]);

    const handleDelete = useCallback(() => {
        if (canvasRef.current !== null) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0,canvas.width, canvas.height);
            deleteDrawing();
        }
    }, [deleteDrawing]);

    
    const handleMouseDown = (event) => {
        event.preventDefault();
        setIsMouseDown(true);
        
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        setPosition({ x, y });
        if (selectedTool === TOOL_TYPES.PENCIL) {
            updateSegment({x, y});
        } else if (selectedTool === TOOL_TYPES.FLOOD_FILL) {
            floodFill({x, y});
        }
    };

    const handleMouseMove = (event) => {
        event.preventDefault();
        if (isMouseDown && selectedTool === TOOL_TYPES.PENCIL) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            setPosition({ x, y });
            updateSegment(position);
        }
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
        if (selectedTool === TOOL_TYPES.PENCIL) {
            endSegment({pencilSize, drawingColor});
        }
    };

    const drawLine = (ctx, startX, startY, endX, endY) => {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    };

    const floodFill = useCallback(({x, y}) => {
        if (canvasRef.current !== null) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            const width = canvas.width;
            const height = canvas.height;

            const stack = [[x, y]]; 
            const startColor = getColorAtPixel(data, x, y, width);

            if (colorsMatch(startColor, hexToRgba(drawingColor))) return;

            const visited = new Uint8Array(width * height);

            const directions = [
                [-1, 0], [1, 0], // left, right
                [0, -1], [0, 1]  // top, bottom
            ];

            while (stack.length > 0) {
                const [px, py] = stack.pop();
                const index = py * width + px;

                if (!visited[index]) {
                    visited[index] = 1;
                    const currentColor = getColorAtPixel(data, px, py, width);

                    if (colorsMatch(currentColor, startColor)) {
                        setColorAtPixel(data, px, py, hexToRgba(drawingColor), width);

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
    }, [drawingColor]);

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
};

export default DrawingBoard;