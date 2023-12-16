import React, { useEffect } from 'react';
import CellListItem from './cell-list-item';
import { insertCellBefore } from '../features/cells/cells-slice';
import { useAppDispatch } from '../app/hooks';
import { CellType } from '../features/cells/types/cell';
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

  const selectedCells = selectOrderedCells();

  const renderedCells = selectedCells.map((cell, index) => (
    <CellListItem key={index} cell={cell} />
  ));

  return <div>{renderedCells}</div>;
};

export default CellList;
