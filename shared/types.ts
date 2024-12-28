export type ColumnType = 'text' | 'number' | 'link' | 'user' | 'tag';

export type AccessorKey =
  | 'displayId'
  | 'plasmid'
  | 'volumeUI'
  | 'lengthBP'
  | 'storageLocation'
  | 'editedBy'
  | 'summary'
  | 'status'
  | 'assignee';

export type CellValue = string | number | Link | User[] | null | undefined;

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
  id: string;
  accessorKey: AccessorKey;
  type: ColumnType;
  label: string;
  editable: boolean;
  order: number;
};

export type Row = {
  [K in AccessorKey]?: CellValue;
} & {
  id: string;
};

export type TableSchema = {
  id: string;
  columns: Column[];
  rows: Row[];
};

type BaseTableUpdate = {
  rowId: string;
  columnKey: string;
};

export type RowUpdate = BaseTableUpdate & {
  type: 'ROW_UPDATE';
  value: string | number | Link;
};

export type UserAssignmentUpdate = BaseTableUpdate & {
  type: 'USER_ASSIGNMENT';
  value: User[];
};

export type TableUpdate = RowUpdate | UserAssignmentUpdate;
