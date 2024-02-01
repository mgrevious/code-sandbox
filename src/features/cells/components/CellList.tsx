import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../../app/hooks';
import { insertCellBefore } from '../cells-slice';
import { selectOrderedCells } from '../selectors';
import { CellType } from '../types/cell';
import CellListItem from './CellListItem';

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
