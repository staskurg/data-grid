export type ColumnType = 'text' | 'number' | 'link' | 'user' | 'tag';

export type User = {
  id: string;
  email: string;
  avatarUrl: string;
};

export type Link = {
  url: string;
  value: string;
};

export interface Column {
  accessorKey: string;
  type: ColumnType;
  label: string;
  editable: boolean;
}

export interface Row {
  [key: string]: any; // Generic to accommodate all column data types

  ID?: Link;
  Plasmid?: string;
  VolumeUI?: number;
  LengthBP?: number;
  StorageLocation?: string;
  EditedBy?: User[];
  AssignedTo?: User[];
}

export interface TableSchema {
  columns: Column[];
  rows: Row[];
}
