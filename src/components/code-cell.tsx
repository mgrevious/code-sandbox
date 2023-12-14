import React, { useState } from 'react';
import CodeEditor from '../components/code-editor';
import Preview from '../components/preview';
import bundle from '../bundler';
import Resizable from './resizable';

interface CodeCellProps {
  darkMode: boolean;
}

const CodeCell: React.FC<CodeCellProps> = ({ darkMode }) => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const onClick = async () => {
    const result = await bundle(input);
    setCode(result);
  };

  return (
    <>
      <Resizable direction={'s'}>
        <>
          <CodeEditor
            darkMode={darkMode}
            initialValue="const a = 1;"
            onChange={(value) => {
              if (value) {
                setInput(value);
              }
            }}
          />
          <Preview code={code} />
        </>
      </Resizable>
    </>
  );
};

export default CodeCell;

{
  /* <textarea
    className="py-2 px-4 border border-zinc-200 dark:border-zinc-700 h-60 rounded-sm mb-4 w-full dark:bg-zinc-900 dark:text-zinc-100"
    value={input}
    onChange={(e) => {
      setInput(e.target.value);
    }}
  /> */
}
