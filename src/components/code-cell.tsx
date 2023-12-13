import React, { useState } from 'react';
import CodeEditor from '../components/code-editor';
import Preview from '../components/preview';
import bundle from '../bundler';

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
      <div className="mt-12">
        <CodeEditor
          darkMode={darkMode}
          initialValue="const a = 1;"
          onChange={(value) => {
            if (value) {
              setInput(value);
            }
          }}
        />
      </div>
      <div>
        <textarea
          className="py-2 px-4 border border-zinc-200 dark:border-zinc-700 h-60 rounded-sm mb-4 w-full dark:bg-zinc-900 dark:text-zinc-100"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button
          className="button button-format is-primary is-normal"
          onClick={onClick}
        >
          Submit
        </button>
      </div>
      <Preview code={code} />
    </>
  );
};

export default CodeCell;
