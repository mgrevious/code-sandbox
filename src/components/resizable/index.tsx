import React from 'react';
import { ResizableBox } from 'react-resizable';

import './resizable-handle.scss';

interface ResizableProps {
  direction: string;
  children?: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    <ResizableBox
      className="relative h-full flex flex-row"
      height={317}
      width={Infinity}
      handle={
        <div
          className={`react-resizable-handle react-resizable-handle-${direction} absolute bottom-0 left-0 right-0`}
        ></div>
      }
      resizeHandles={['s']}
    >
      {children}
    </ResizableBox>
  );
};

export default Resizable;
