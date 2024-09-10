export const BOARD_DEFAULT_SIZE = 600;

export const DEFAULT_PENCIL_SIZE = 5;
export const MINIMUM_PENCIL_SIZE = 1;
export const MAXIMUM_PENCIL_SIZE = 20;

export const UNDO_LIMIT = 50;

export const LINE_JOIN = 'round';
export const LINE_CAP = 'round';


export const COLOR_SELECTOR_BOX_WIDTH = 20;
export const COLOR_SELECTOR_BOX_HEIGHT = 20;
export const DEFAULT_DRAWING_COLOR = '#000000';
export const drawingColors = [
'#000000', // Black
'#ffffff', // White
'#7f7f7f', // Gray
'#c3c3c3', // Light Gray
'#791918', // Shade of red
'#ac7e58', // Brown
'#d33d2a', // Red
'#e9892e', // Orange
'#ebe6b1', // Light Brown
'#f2cf1c', // Golden
'#f9f614', // Yellow
'#f0b1c9', // Pink
'#5ab04c', // Green
'#bee821', // Light Green
'#4b3ccb', // Dark Blue
'#589ce7', // Blue
'#7b8fbe', // Light Dark Blue
'#abd6ea', // Light Blue
'#964aa4', // Purple
'#c7bee7', // Light Purple
]; 

export const TOOL_TYPES = {
    PENCIL: 'pencil',
    FLOOD_FILL: 'flood_fill',
};

export const DEFAULT_TOOL = TOOL_TYPES.PENCIL;

export const DRAWING_UPDATE_TYPES = {
    DELETE: 'delete',
    UNDO: 'undo',
    ADD_TO_SEGMENT: 'add_to_segment',
    END_SEGMENT: 'end_segment',
    ADD_FLOOD_FILL: "add_flood_fill",
};
