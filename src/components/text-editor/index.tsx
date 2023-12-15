import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

import './text-editor.scss';

const TextEditor: React.FC = () => {
  const [input, setInput] = useState('');
  const [editing, setEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Remove Editor when clicking outside of it
    const listener = (e: MouseEvent) => {
      if (
        e.target instanceof Element &&
        ((editorRef.current && editorRef.current.contains(e.target as Node)) ||
          e.target.id.includes('headlessui-switch'))
      ) {
        // use e.target to figure out if user is clicking outside of the Editor
        return;
      }
      setEditing(false);
    };
    document.addEventListener('click', listener, { capture: true });
    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div ref={editorRef}>
        <MDEditor
          className="md-text-editor"
          value={input}
          onChange={(value) => {
            if (value) {
              setInput(value);
            }
          }}
          previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
        />
      </div>
    );
  }
  return (
    <div onClick={() => setEditing(true)}>
      <div className="wmde-markdown-var"></div>

      <MDEditor.Markdown className="md-text-editor" source="#Header" />
    </div>
  );
};

export default TextEditor;
