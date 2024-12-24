import { User, Row, TableSchema } from './types';
import { mockUsers, table1, table2 } from './mocks';

export const getUsers = (): User[] => mockUsers;

export const getTable = (tableId: string): TableSchema | null => {
  if (tableId === 'table1') return table1;
  if (tableId === 'table2') return table2;
  return null;
};

export const updateTableRows = (
  tableId: string,
  rows: Row[]
): TableSchema | null => {
  if (tableId === 'table1') {
    table1.rows = rows;
    return table1;
  }
  if (tableId === 'table2') {
    table2.rows = rows;
    return table2;
  }
  return null;
};
