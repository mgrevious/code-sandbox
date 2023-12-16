import {
  // ActionReducerMapBuilder,
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { Cell, CellTypes, randomId } from './types/cell';
import { Direction, DirectionType } from './types/direction';

export interface CellState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const cellsSlice = createSlice({
  name: 'cells',
  initialState,
  reducers: {
    updateCell: (
      state: CellState,
      action: PayloadAction<{ id: string; content: string }>,
    ) => {
      // Updating content of Cell located by payload id
      state.data[action.payload.id].content = action.payload.content;
    },
    deleteCell: (state: CellState, action: PayloadAction<string>) => {
      state.order = state.order.filter((id) => id !== action.payload);
      delete state.data[action.payload];
    },
    insertCellBefore: (
      state: CellState,
      action: PayloadAction<{
        id: string | null;
        type: CellTypes;
      }>,
    ) => {
      console.log('called...inside insertCellBefore');
      const cell: Cell = {
        content: '',
        type: action.payload.type,
        id: randomId(),
      };
      // find index of id before which the new item will be inserted
      const foundIndex = state.order.findIndex(
        (id) => action.payload.id === id,
      );
      if (foundIndex < 0) {
        state.order.push(cell.id);
      } else {
        state.order.splice(foundIndex, 0, cell.id);
      }
    },
    moveCell: (
      state: CellState,
      action: PayloadAction<{ id: string; direction: Direction }>,
    ) => {
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => action.payload.id === id);
      const targetIndex =
        direction === DirectionType.UP ? index - 1 : index + 1;
      // check to make sure movement is not outside the bounds of the array
      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return;
      }
      // remove the id located at the target index over to the current id's index
      state.order[index] = state.order[targetIndex];
      // move the current id to the target index
      state.order[targetIndex] = action.payload.id;
    },
  },
  // extraReducers: (builder: ActionReducerMapBuilder<CellState>) => {},
});

export default cellsSlice.reducer;

export const { moveCell, updateCell, deleteCell, insertCellBefore } =
  cellsSlice.actions;
