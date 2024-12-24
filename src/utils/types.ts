import { ACCESSOR_KEYS } from './constants';

export type ColumnType = 'text' | 'number' | 'link' | 'user' | 'tag';

export type CellValue = string | number | Link | User[] | null | undefined;

export type AccessorKey = (typeof ACCESSOR_KEYS)[keyof typeof ACCESSOR_KEYS];

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type Link = {
  url: string;
  value: string;
};

export type Column = {
  accessorKey: AccessorKey;
  type: ColumnType;
  label: string;
  editable: boolean;
};

export type Row = {
  [K in AccessorKey]?: CellValue;
} & {
  id: string;
};

export type TableSchema = {
  columns: Column[];
  rows: Row[];
};
