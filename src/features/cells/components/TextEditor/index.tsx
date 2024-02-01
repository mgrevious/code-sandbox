import { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { Cell } from '../../types';
import { useAppDispatch } from '../../../../app/hooks';
import { updateCell } from '../../cells-slice';

import './TextEditor.scss';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const dispatch = useAppDispatch();
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
          value={cell.content}
          onChange={(value) => {
            dispatch(updateCell({ id: cell.id, content: value || '' }));
          }}
          previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
        />
      </div>
    );
  }
  return (
    <button type="button" onClick={() => setEditing(true)}>
      <div className="wmde-markdown-var"></div>

      <MDEditor.Markdown
        className="ml-3 mt-2 button md-text-editor md-text-editor-markdown"
        source={cell.content || 'Click to edit'}
      />
    </button>
  );
};

export default TextEditor;
