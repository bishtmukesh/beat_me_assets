import React from 'react';
import Header from './Header'
// import Button from '@mui/material/Button';
import DrawingBoard from '../../components/DrawingBoard';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../../constant/drawingBoard';

function TestPage() {
  return (
    <div>
    	<Header />

      <DrawingBoard 
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
      />

    </div>
  );
}

export default TestPage;