import { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { DRAWING_UPDATE_TYPES, TOOL_TYPES } from '../../constant/drawingBoard';
 
const useMouseEvents = ( { 
    canvasRef, 
    canDraw, 
    selectedTool, 
    pencilSize, 
    drawingColor, 
    segment,
    updateSegment, 
    endSegment, 
    quickFill,
    addFloodFill,
    sendPictionaryUpdateMessage,
}) => {

    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isInside, setIsInside] = useState(false);

    const handleGlobalMouseMovement = useCallback((event) => {
        if (canvasRef.current !== null && isMouseDown && isInside) { 
            
            const canvas = canvasRef.current;
            const canvasRect = canvas.getBoundingClientRect();
            const x = event.clientX - canvasRect.left;
            const y = event.clientY - canvasRect.top;

            const isOutside =
                event.clientX < canvasRect.left ||
                event.clientX > canvasRect.right ||
                event.clientY < canvasRect.top ||
                event.clientY > canvasRect.bottom;

            if (isOutside) {
                setIsInside(false);
                updateSegment({x, y});
                sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.ADD_TO_SEGMENT, {x, y});
            }
        }
    }, [canvasRef, isMouseDown, isInside, setIsInside, updateSegment, sendPictionaryUpdateMessage]);

    const handleMouseMove = useCallback((event) => {
        event.preventDefault();

        if (!canDraw) return;

        if (canvasRef.current !== null) {
            if (isMouseDown && selectedTool === TOOL_TYPES.PENCIL) {
                const canvasRect = canvasRef.current.getBoundingClientRect(); 
                const x = event.clientX - canvasRect.left;
                const y = event.clientY - canvasRect.top;

                updateSegment({x, y});
                sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.ADD_TO_SEGMENT, {x, y});
            }
        }
    }, [canvasRef, canDraw, isMouseDown, selectedTool, updateSegment, sendPictionaryUpdateMessage]);

    const handleMouseDown = useCallback((event) => {
        event.preventDefault();
        setIsMouseDown(true);

        if (!canDraw) return;
        
        if (canvasRef.current !== null) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            if (selectedTool === TOOL_TYPES.PENCIL) {
                updateSegment({x, y});
                sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.ADD_TO_SEGMENT, {x, y}, drawingColor, pencilSize);
            } else if (selectedTool === TOOL_TYPES.FLOOD_FILL) {
                addFloodFill({startPoint : {x, y}, drawingColor});
                quickFill({x, y}, drawingColor);
                sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.ADD_FLOOD_FILL, {x, y}, drawingColor);
            }
        }
    }, [canvasRef, setIsMouseDown, canDraw, pencilSize, selectedTool, drawingColor, updateSegment, addFloodFill, quickFill, sendPictionaryUpdateMessage]);

    const handleMouseUp = useCallback(() => {
        setIsMouseDown(false);

        if (!canDraw) return;

        if (selectedTool === TOOL_TYPES.PENCIL) {
            endSegment({pencilSize, drawingColor});
            sendPictionaryUpdateMessage(DRAWING_UPDATE_TYPES.END_SEGMENT);
        }
    }, [setIsMouseDown, canDraw, selectedTool, drawingColor, pencilSize, endSegment, sendPictionaryUpdateMessage]);

    const handleMouseEnter = useCallback((event) => {
        setIsInside(true);
    }, [setIsInside]);

    useEffect(() => {
        document.addEventListener('mousemove', handleGlobalMouseMovement);

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMovement);
        };
    }, [handleGlobalMouseMovement]);

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsMouseDown(false);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [endSegment]);

    return {
        handleGlobalMouseMovement,
        handleMouseMove,
        handleMouseEnter,
        handleMouseDown,
        handleMouseUp,
    };
}

useMouseEvents.propTypes = {
    canvasRef: PropTypes.shape({
        current: PropTypes.instanceOf(Element)
    }),
    canDraw: PropTypes.bool.isRequired,
    selectedTool: PropTypes.string.isRequired,
    pencilSize: PropTypes.number.isRequired,
    drawingColor: PropTypes.string.isRequired,
    segment: PropTypes.array.isRequired,
    updateSegment: PropTypes.func.isRequired,
    endSegment: PropTypes.func.isRequired,
    quickFill: PropTypes.func.isRequired,
    addFloodFill: PropTypes.func.isRequired,
    sendPictionaryUpdateMessage: PropTypes.func.isRequired,
};

export default useMouseEvents;