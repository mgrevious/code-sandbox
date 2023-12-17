import React, { useState, useEffect } from 'react';
import CodeEditor from '../code-editor';
import Preview from '../preview';
import bundle from '../../../../bundler';
import Resizable from '../resizable';

import './code-cell.scss';
import { Direction } from '../../../../constants/Direction';

interface CodeCellProps {
  darkMode: boolean;
}

const CodeCell: React.FC<CodeCellProps> = ({ darkMode }) => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    // Debounce the state changes by waiting to execute timer until after 1 sec has elapsed
    // 1) useEffect is called on every input state change, and time is cleared automatically
    // 2) Once user stops typing and 1 sec has elapsed, bundle will execute
    const timer = setTimeout(async () => {
      const result = await bundle(input);
      setCode(result.code);
      setErr(result.err);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <>
      <Resizable direction={Direction.VERTICAL} className="w-full">
        <>
          <Resizable direction={Direction.HORIZONTAL} className="">
            <CodeEditor
              darkMode={darkMode}
              initialValue="const a = 1;"
              onChange={(value) => {
                if (value) {
                  setInput(value);
                }
              }}
            />
          </Resizable>
          <Preview code={code} error={err} />
        </>
      </Resizable>
    </>
  );
};

export default CodeCell;
