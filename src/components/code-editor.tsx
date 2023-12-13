import Editor, { OnChange } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import * as prettier from 'prettier';
import { useRef } from 'react';
import parserBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';

interface CodeEditorProps {
  darkMode: boolean;
  initialValue: string;
  onChange: OnChange;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue,
  onChange,
  darkMode,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const onFormatClick = async () => {
    if (editorRef.current) {
      // get current value from editor
      const unformatted = editorRef.current.getValue();
      // format that value
      const formatted = await prettier.format(unformatted, {
        parser: 'babel',
        // plugin error fixed: https://github.com/prettier/prettier/issues/15473
        plugins: [parserBabel, prettierPluginEstree],
        semi: true,
        singleQuote: true,
        useTabs: false,
      });
      // set the formatted value back in the editor
      editorRef.current.setValue(formatted);
    }
  };
  return (
    <div>
      <div className="relative group">
        <button
          className={`opacity-0 button button-format is-small ${
            darkMode ? 'is-dark' : 'is-light'
          } mb-4 absolute right-0 top-0 z-10 group-hover:opacity-100 transition-opacity duration-300`}
          onClick={onFormatClick}
        >
          Format
        </button>
        <Editor
          className={`border ${
            darkMode ? 'border-zinc-900' : 'border-zinc-200'
          } h-80`}
          onChange={onChange}
          onMount={(editor: editor.IStandaloneCodeEditor) => {
            editor.updateOptions({ tabSize: 2 });
            editorRef.current = editor;
          }}
          value={initialValue}
          //   height="50vh"
          language="javascript"
          theme={darkMode ? 'vs-dark' : 'light'}
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
    </div>
  );
};

export default CodeEditor;
