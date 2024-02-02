import Editor, { OnChange } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import * as prettier from 'prettier';
import parserBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import React, { useRef } from 'react';

import { useTypedSelector } from '../../../app/hooks';

interface CodeEditorProps {
  initialValue: string;
  onChange: OnChange;
}

function formatByPrettier(
  ref: React.MutableRefObject<editor.IStandaloneCodeEditor | null>,
): Promise<string> {
  // get current value from editor
  const unformatted = ref && ref.current ? ref.current.getValue() : '';
  // format that value
  return prettier.format(unformatted, {
    parser: 'babel',
    // plugin error fixed: https://github.com/prettier/prettier/issues/15473
    plugins: [parserBabel, prettierPluginEstree],
    semi: true,
    singleQuote: true,
    useTabs: false,
  });
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const darkModeEnabled = useTypedSelector((state) => state.cells.darkMode);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const onFormatClick = () => {
    if (editorRef.current) {
      // // get current value from editor
      // const unformatted = editorRef.current.getValue();
      // // format that value
      // let formatted = await prettier.format(unformatted, {
      //   parser: 'babel',
      //   // plugin error fixed: https://github.com/prettier/prettier/issues/15473
      //   plugins: [parserBabel, prettierPluginEstree],
      //   semi: true,
      //   singleQuote: true,
      //   useTabs: false,
      // });

      // formatted = formatted.replace(/\n$/, '');
      formatByPrettier(editorRef)
        .then((result) => {
          let formatted = result;
          if (formatted) {
            formatted = formatted.replace(/\n$/, '');
            // set the formatted value back in the editor
            if (editorRef?.current) {
              editorRef.current.setValue(formatted);
            }
          }
        })
        .catch(console.error);
    }
  };
  return (
    <div className="relative group h-full w-full">
      <button
        className={`opacity-0 button button-format is-small ${
          darkModeEnabled ? 'is-white' : 'is-light'
        } mb-4 absolute right-5 top-2 z-10 group-hover:opacity-100 transition-opacity duration-300`}
        onClick={onFormatClick}
      >
        Format
      </button>
      <Editor
        className={`border ${
          darkModeEnabled ? 'border-zinc-900' : 'border-zinc-200'
        }`}
        onChange={onChange}
        onMount={(editor: editor.IStandaloneCodeEditor) => {
          editor.updateOptions({ tabSize: 2 });
          editorRef.current = editor;
        }}
        value={initialValue}
        language="javascript"
        theme={darkModeEnabled ? 'vs-dark' : 'light'}
        options={{
          wordWrap: 'on',
          minimap: { enabled: false }, // hide mini map positioned on the right of the editor
          showUnused: false, // don't fade out variables that aren't used
          folding: false, // removes space to right line numbers,
          lineNumbersMinChars: 3, // reduce space to left of line numbers,
          scrollBeyondLastLine: false,
          automaticLayout: true, // allow user to shrink and grow editor, as components are added
        }}
      />
    </div>
  );
};

export default CodeEditor;
