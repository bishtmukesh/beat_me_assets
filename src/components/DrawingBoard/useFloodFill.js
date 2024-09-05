import { useCallback } from 'react';
import PropTypes from 'prop-types';
 
const useFloodFill = ( { canvasRef } ) => {

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

    const quickFill = useCallback((startPoint, fillColor) => {
        if (canvasRef.current !== null) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
    
            const width = canvas.width;
            const height = canvas.height;
    
            const startX = Math.round(startPoint.x);
            const startY = Math.round(startPoint.y);
    
            const stack = [[startX, startY]]; 
            const startColor = getColorAtPixel(data, startX, startY, width);
    
            if (colorsMatch(startColor, hexToRgba(fillColor))) return;
    
            const visited = new Uint8Array(width * height);
    
            while (stack.length > 0) {
                const [x, y] = stack.pop();
                let leftX = x;
                let rightX = x;
    
                while (leftX >= 0 && colorsMatch(getColorAtPixel(data, leftX, y, width), startColor)) {
                    leftX--;
                }
                leftX++;
    
                while (rightX < width && colorsMatch(getColorAtPixel(data, rightX, y, width), startColor)) {
                    rightX++;
                }
                rightX--;
    
                for (let i = leftX; i <= rightX; i++) {
                    setColorAtPixel(data, i, y, hexToRgba(fillColor), width);
                    visited[y * width + i] = 1;
                }
    
                if (y > 0) {
                    let skip = false;
                    for (let i = leftX; i <= rightX; i++) {
                        if (!visited[(y - 1) * width + i] && colorsMatch(getColorAtPixel(data, i, y - 1, width), startColor)) {
                            if (!skip) {
                                stack.push([i, y - 1]);
                                skip = true;
                            }
                        } else {
                            skip = false;
                        }
                    }
                }
                
                if (y < height - 1) {
                    let skip = false;
                    for (let i = leftX; i <= rightX; i++) {
                        if (!visited[(y + 1) * width + i] && colorsMatch(getColorAtPixel(data, i, y + 1, width), startColor)) {
                            if (!skip) {
                                stack.push([i, y + 1]);
                                skip = true;
                            } else {
                                skip = false;
                            }
                        }
                    }
                }
            }
    
            ctx.putImageData(imageData, 0, 0);
        }
    }, [canvasRef]);

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

    return {
        floodFill,
        quickFill,
    };
}

useFloodFill.propTypes = {
    canvasRef: PropTypes.shape({
        current: PropTypes.instanceOf(Element)
    }),
};

export default useFloodFill;