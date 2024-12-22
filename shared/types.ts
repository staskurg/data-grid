export type ColumnType = 'text' | 'number' | 'link' | 'user' | 'tag';

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
  accessorKey: string;
  type: ColumnType;
  label: string;
  editable: boolean;
};

export type Row = {
  [key: string]: CellValue;
  ID?: Link;
  Plasmid?: string;
  VolumeUI?: number;
  LengthBP?: number;
  StorageLocation?: string;
  EditedBy?: User[];
  AssignedTo?: User[];
};

export type TableSchema = {
  columns: Column[];
  rows: Row[];
};
