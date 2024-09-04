import React from 'react';
import Header from './Header'

import DrawingBoard from '../../components/DrawingBoard';
import SocketTest from '../../components/SocketTest';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../../constant/drawingBoard';

function TestPage() {
  return (
    <div>
    	<Header />

      <DrawingBoard 
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
      />

      <SocketTest />
    </div>
  );
}

export default TestPage;