import { configureStore } from '@reduxjs/toolkit';
import cellsReducer from '../features/cells/cells-slice';
import { ActionType } from './state/action-types';
import { CellType } from '../features/cells/types/cell';

export const store = configureStore({
  reducer: {
    cells: cellsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
