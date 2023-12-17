import React from 'react';
import { useAppDispatch } from '../../../../app/hooks';
import { deleteCell, moveCell } from '../../cells-slice';
import { DirectionType } from '../../types';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex justify-end bg-white border-2 border-zinc-100">
      <button
        title="up"
        className="h-7 w-10 flex items-center justify-center border-l-2 border-r-2 border-zinc-100"
        onClick={() => {
          dispatch(moveCell({ id, direction: DirectionType.UP }));
        }}
      >
        <i className="text-zinc-800 text-xs fa-solid fa-angle-up"></i>
      </button>
      <button
        title="up"
        className="h-7 w-10 flex items-center justify-center border-r-2 border-zinc-100"
        onClick={() => {
          dispatch(moveCell({ id, direction: DirectionType.DOWN }));
        }}
      >
        <i className="text-zinc-800 text-xs fa-solid fa-angle-down"></i>
      </button>
      <button
        title="up"
        className="h-7 w-10 items-center justify-center border-zinc-100"
        onClick={() => {
          dispatch(deleteCell(id));
        }}
      >
        <i className="text-zinc-800 text-xs fa-solid fa-trash-can"></i>
      </button>
    </div>
  );
};

export default ActionBar;
