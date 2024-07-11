export const BOARD_WIDTH = 600;
export const BOARD_HEIGHT = 600;

export const DEFAULT_PENCIL_SIZE = 5;
export const MINIMUM_PENCIL_SIZE = 1;
export const MAXIMUM_PENCIL_SIZE = 15;

export const LINE_JOIN = 'round';
export const LINE_CAP = 'round';


export const COLOR_SELECTOR_BOX_WIDTH = 15;
export const DEFAULT_DRAWING_COLOR = '#000000';
export const drawingColors = [
'#FF0000', // Red
'#0000FF', // Blue
'#FFFF00', // Yellow
'#008000', // Green
'#FFA500', // Orange
'#800080', // Purple
'#000000', // Black
'#808080', // Gray
'#A52A2A', // Brown
'#FFC0CB', // Pink
'#ADD8E6', // Light Blue
'#98FF98', // Mint Green
'#FFFF33', // Bright Yellow
'#000080'  // Navy
]; 

export const TOOL_TYPES = {
    PENCIL: 'pencil',
    FLOOD_FILL: 'flood-fill',
};

export const DEFAULT_TOOL = TOOL_TYPES.PENCIL;