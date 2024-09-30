import { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { DRAWING_UPDATE_TYPES, TOOL_TYPES } from '../../constant/drawingBoard';
import { unscalePoint } from '../../utils/scale';
 
const useMouseEvents = ({
    canvasSize, 
    canvasRef, 
    canDraw, 
    selectedTool, 
    pencilSize, 
    drawingColor,
    updateSegment, 
    endSegment,
    saveBoardState, 
    quickFill,
    addFloodFill,
    getImageData,
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
                sendPictionaryUpdateMessage({ udpateType : DRAWING_UPDATE_TYPES.ADD_TO_SEGMENT, point : unscalePoint(x, y, canvasSize) });
            }
        }
    }, [canvasRef, canvasSize, isMouseDown, isInside, setIsInside, updateSegment, sendPictionaryUpdateMessage]);

    const handleMouseMove = useCallback((event) => {
        event.preventDefault();

        if (!canDraw) return;

        if (canvasRef.current !== null) {
            if (isMouseDown && selectedTool === TOOL_TYPES.PENCIL) {
                const canvasRect = canvasRef.current.getBoundingClientRect(); 
                const x = event.clientX - canvasRect.left;
                const y = event.clientY - canvasRect.top;

                updateSegment({x, y});
                sendPictionaryUpdateMessage({ updateType : DRAWING_UPDATE_TYPES.ADD_TO_SEGMENT, point : unscalePoint(x, y, canvasSize) });
            }
        }
    }, [canvasRef, canvasSize, canDraw, isMouseDown, selectedTool, updateSegment, sendPictionaryUpdateMessage]);

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
                sendPictionaryUpdateMessage({ updateType : DRAWING_UPDATE_TYPES.ADD_TO_SEGMENT, point : unscalePoint(x, y, canvasSize), 
                                              drawingColor, pencilSize });
            } else if (selectedTool === TOOL_TYPES.FLOOD_FILL) {
                addFloodFill({startPoint : {x, y}, drawingColor});
                quickFill({x, y}, drawingColor);
                saveBoardState(getImageData());
                sendPictionaryUpdateMessage({ updateType : DRAWING_UPDATE_TYPES.ADD_FLOOD_FILL, point : unscalePoint(x, y, canvasSize), drawingColor });
            }
        }
    }, [canvasRef, canvasSize, setIsMouseDown, canDraw, pencilSize, selectedTool, drawingColor, updateSegment, 
        addFloodFill, quickFill, sendPictionaryUpdateMessage, saveBoardState, getImageData]);

    const handleMouseUp = useCallback(() => {
        setIsMouseDown(false);

        if (!canDraw) return;

        if (selectedTool === TOOL_TYPES.PENCIL) {
            endSegment({pencilSize, drawingColor});
            saveBoardState(getImageData());
            sendPictionaryUpdateMessage({ updateType : DRAWING_UPDATE_TYPES.END_SEGMENT });
        }
    }, [setIsMouseDown, canDraw, selectedTool, drawingColor, pencilSize, endSegment, sendPictionaryUpdateMessage, getImageData, saveBoardState]);

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
    canvasSize: PropTypes.number.isRequired,
    canvasRef: PropTypes.shape({
        current: PropTypes.instanceOf(Element)
    }),
    canDraw: PropTypes.bool.isRequired,
    selectedTool: PropTypes.string.isRequired,
    pencilSize: PropTypes.number.isRequired,
    drawingColor: PropTypes.string.isRequired,
    updateSegment: PropTypes.func.isRequired,
    endSegment: PropTypes.func.isRequired,
    saveBoardState: PropTypes.func.isRequired,
    quickFill: PropTypes.func.isRequired,
    addFloodFill: PropTypes.func.isRequired,
    getImageData: PropTypes.func.isRequired,
    sendPictionaryUpdateMessage: PropTypes.func.isRequired,
};

export default useMouseEvents;