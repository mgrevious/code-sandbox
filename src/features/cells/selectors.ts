import { createSelector } from '@reduxjs/toolkit';
import { CellState } from './cells-slice';
import { store } from '../../app/store';

// Had to use createSelector to memoize selector function to prevent unnecessary re-renders
// See: https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization
const selectCells = createSelector(
  [(state: CellState) => state],
  ({ order, data }) => {
    return order.map((id) => data[id]);
  },
);
const state = store.getState();

export const selectOrderedCells = () => selectCells(state.cells);
