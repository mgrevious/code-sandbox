import React from 'react';
import { Cell, CellType } from '../types/cell';
import CodeCell from './code-cell';
import TextEditor from './text-editor';
import ActionBar from './action-bar';

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  return (
    <div className="mb-12 relative">
      <ActionBar id={cell.id} />
      {cell.type === CellType.CODE ? (
        <CodeCell cell={cell} />
      ) : (
        <TextEditor cell={cell} />
      )}
    </div>
  );
};

export default CellListItem;
