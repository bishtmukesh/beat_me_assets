import { BOARD_DEFAULT_SIZE } from "../constant/drawingBoard";

export const scalePoint = (x, y, targetSize) => {
    const scaleFactor = targetSize / BOARD_DEFAULT_SIZE;
    
    return { 
        x: x * scaleFactor, 
        y: y * scaleFactor,
    };
}

export const unscalePoint = (x, y, targetSize) => {
    const scaleFactor = BOARD_DEFAULT_SIZE / targetSize;

    return { 
        x: x * scaleFactor, 
        y: y * scaleFactor, 
    };
}