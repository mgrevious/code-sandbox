import { configureStore } from '@reduxjs/toolkit';
import cellsReducer from '../features/cells/cells-slice';

export const store = configureStore({
  reducer: {
    cells: cellsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
