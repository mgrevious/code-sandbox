import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

import './text-editor.scss';

const TextEditor: React.FC = () => {
  const [value, setValue] = useState('#Header');
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
          className="md-editor-custom-pre md-text-editor"
          value={value}
          onChange={(value) => {
            setValue(value || '');
          }}
          previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
        />
      </div>
    );
  }
  return (
    <div onClick={() => setEditing(true)}>
      <div className="wmde-markdown-var"></div>

      <MDEditor.Markdown
        className="md-text-editor md-text-editor-markdown"
        source={value}
      />
    </div>
  );
};

export default TextEditor;
