import { COLUMN_TYPES, TABLE_UPDATE_TYPES } from 'src/utils/constants';

import type {
  AccessorKey,
  ColumnType,
  Link,
  TableUpdate,
  User,
} from 'shared/types';

const createTableUpdate = (
  rowId: string,
  columnKey: AccessorKey,
  columnType: ColumnType,
  value: string | number | Link | User[]
): TableUpdate => {
  if (columnType === COLUMN_TYPES.USER) {
    return {
      type: TABLE_UPDATE_TYPES.USER_ASSIGNMENT,
      rowId,
      columnKey,
      value: value as User[],
    };
  }
  return {
    type: TABLE_UPDATE_TYPES.ROW_UPDATE,
    rowId,
    columnKey,
    value: value as string | number | Link,
  };
};

export default createTableUpdate;
