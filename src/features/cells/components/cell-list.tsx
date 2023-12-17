import React, { useEffect } from 'react';
import CellListItem from './cell-list-item';
import { insertCellBefore } from '../cells-slice';
import { useAppDispatch } from '../../../app/hooks';
import { CellType } from '../types/cell';
import { useSelector } from 'react-redux';
import { selectOrderedCells } from '../selectors';

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

  const renderedCells = useSelector(selectOrderedCells);

  return (
    <div>
      {renderedCells.map((cell, index) => (
        <CellListItem key={index} cell={cell} />
      ))}
    </div>
  );
};

export default CellList;
