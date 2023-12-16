import React, { useEffect } from 'react';
import CellListItem from './cell-list-item';
import { insertCellBefore } from '../features/cells/cells-slice';
import { useAppDispatch } from '../app/hooks';
import { CellType } from '../features/cells/types/cell';
import { createSelector } from '@reduxjs/toolkit';
import { RootState, store } from '../app/store';
import { useSelector } from 'react-redux';
import { selectOrderedCells } from '../features/cells/selectors';

const CellList: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      insertCellBefore({
        type: CellType.CODE,
        id: null,
      }),
    );

    dispatch(
      insertCellBefore({
        type: CellType.TEXT,
        id: null,
      }),
    );
  }, [dispatch]);

  const renderedCells = useSelector((state: RootState) =>
    selectOrderedCells(state),
  );

  return (
    <div>
      {renderedCells.map((cell, index) => (
        <CellListItem key={index} cell={cell} />
      ))}
    </div>
  );
};

export default CellList;
