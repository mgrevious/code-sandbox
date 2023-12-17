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
    <div className="absolute -top-5 right-0 z-10 flex bg-white border-2 rounded-sm border-zinc-200 shadow-sm">
      <button
        title="up"
        className="h-8 w-10 flex items-center justify-center border-r-2 border-zinc-200"
        onClick={() => {
          dispatch(moveCell({ id, direction: DirectionType.UP }));
        }}
      >
        <i className="text-zinc-800 text-xs fa-solid fa-angle-up"></i>
      </button>
      <button
        title="up"
        className="h-8 w-10 flex items-center justify-center border-r-2 border-zinc-200"
        onClick={() => {
          dispatch(moveCell({ id, direction: DirectionType.DOWN }));
        }}
      >
        <i className="text-zinc-800 text-xs fa-solid fa-angle-down"></i>
      </button>
      <button
        title="up"
        className="h-8 w-10 items-center justify-center border-zinc-200"
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
