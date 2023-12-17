export enum CellType {
  CODE = 'code',
  TEXT = 'text',
}

export type CellTypes = CellType.CODE | CellType.TEXT;

export interface Cell {
  content: string;
  id: string;
  type: CellTypes;
}
