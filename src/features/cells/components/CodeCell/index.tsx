import React, { useCallback, useEffect, useState } from 'react';

import bundle from '../../../../bundler';
import { Direction } from '../../../../constants/Direction';
import { updateCell } from '../../cells-slice';
import { Cell } from '../../types';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';
import Resizable from '../Resizable';
import './CodeCell.scss';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [timer, setTimer] = useState(0);
  function delay(ms: number): Promise<number> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleBundle = useCallback(
    async function handleBundle() {
      const result = await bundle(cell.content);
      setCode(result.code);
      setErr(result.err);
    },
    [cell.content],
  );

  const debounce = useCallback(
    async function debounce() {
      const timerId = await delay(5000);
      await handleBundle();
      return timerId;
    },
    [handleBundle],
  );

  useEffect(() => {
    // Debounce the state changes by waiting to execute timer until after 1 sec has elapsed
    // 1) useEffect is called on every input state change, and time is cleared automatically
    // 2) Once user stops typing and 1 sec has elapsed, bundle will execute
    // const timer = setTimeout(async () => {
    //   const result = await bundle(cell.content);
    //   setCode(result.code);
    //   setErr(result.err);
    // }, 1000);
    debounce()
      .then((timerId) => {
        setTimer(timerId);
      })
      .catch(console.error);

    return () => {
      if (timer > 0) {
        clearTimeout(timer);
      }
    };
  }, [cell.content, timer, debounce]);

  return (
    <>
      <Resizable direction={Direction.VERTICAL} className="w-full">
        <>
          <Resizable direction={Direction.HORIZONTAL} className="">
            <CodeEditor
              initialValue={cell.content}
              onChange={(value) => {
                if (value) {
                  updateCell({ id: cell.id, content: value });
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
