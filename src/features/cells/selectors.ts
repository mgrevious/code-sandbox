import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// Had to use createSelector to memoize selector function to prevent unnecessary re-renders
// See: https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization
export const selectOrderedCells = createSelector(
  (state: RootState) => state.cells,
  ({ order, data }) => order.map((id) => data[id]),
);
