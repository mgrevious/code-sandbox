import React from 'react';
import { Cell, CellType } from '../types/cell';
import CodeCell from './code-cell';
import TextEditor from './text-editor';

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  return (
    <div className="mb-6">
      {cell.type === CellType.CODE ? (
        <CodeCell darkMode={false} />
      ) : (
        <TextEditor />
      )}
    </div>
  );
};

export default CellListItem;
