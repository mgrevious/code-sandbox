import React, { SyntheticEvent, useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';

import classes from './handle.module.scss';
import { Direction } from '../../constants/Direction';

interface ResizableProps {
  className: string;
  direction: Direction;
  children?: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({
  direction,
  children,
  className: resizableClassNames,
}) => {
  let resizableProps: ResizableBoxProps;
  let handleDirection: string;
  let handlePosition: string;
  let className: string = resizableClassNames;

  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // Use a debounce technique to reduce number of updates when user is resizing browser window
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        // works around react-resizable bug where the max constraints aren't respected when resizing the browser window.
        // if the current width of the browser window is smaller than the calculated width of the resizable code editor, set width of the code editor
        // to match the current window width
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };

    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  if (direction === Direction.HORIZONTAL) {
    resizableProps = {
      height: Infinity,
      maxConstraints: [innerWidth * 0.75, Infinity],
      minConstraints: [innerWidth * 0.2, Infinity],
      resizeHandles: ['e'],
      width,
      onResizeStop: (_: SyntheticEvent, data) => {
        setWidth(data.size.width);
      },
    };
    className = `${resizableClassNames} flex flex-row`;
    handleDirection = 'e';
    handlePosition = 'absolute bottom-0 right-0';
  } else {
    resizableProps = {
      height: 300,
      maxConstraints: [Infinity, innerHeight * 0.8],
      minConstraints: [Infinity, 50],
      resizeHandles: ['s'],
      width: Infinity,
    };
    handleDirection = 's';
    handlePosition = 'absolute bottom-0 left-0 right-0';
  }
  return (
    <ResizableBox
      className={`relative h-full flex ${className}`}
      handle={
        <div
          className={`${classes['react-resizable-handle']} ${
            classes[`react-resizable-handle-${handleDirection}`]
          } ${handlePosition}`}
        ></div>
      }
      {...resizableProps}
    >
      {children}
    </ResizableBox>
  );
};

export default Resizable;
