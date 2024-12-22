import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import {
  LinkCell,
  UserCell,
  NumberCell,
  TagCell,
  TextCell,
} from './CellRenderers';
import { COLUMN_TYPES } from '../../utils/constants';

import type {
  Column,
  Row,
  User,
  Link,
  ColumnType,
  CellValue,
} from '../../../shared/types';

type TableProps = {
  columns: Column[];
  rows: Row[];
  onRowsChange: (newRows: Row[]) => void;
};

const renderCell = (type: ColumnType, value: CellValue) => {
  switch (type) {
    case COLUMN_TYPES.LINK:
      return <LinkCell value={value as Link} />;

    case COLUMN_TYPES.USER:
      return <UserCell value={value as User[]} />;

    case COLUMN_TYPES.NUMBER:
      return <NumberCell value={value as number} />;

    case COLUMN_TYPES.TAG:
      return <TagCell value={value as string} />;

    default:
      return <TextCell value={value as string} />;
  }
};

const Table = ({ columns, rows }: TableProps) => {
  const tableColumns = useMemo<MRT_ColumnDef<Row>[]>(
    () =>
      columns.map(col => ({
        accessorKey: col.accessorKey,
        header: col.label,
        Cell: ({ cell }) => renderCell(col.type, cell.getValue() as CellValue),
      })),
    [columns]
  );

  return (
    <MaterialReactTable
      columns={tableColumns}
      data={rows}
      enableRowSelection
      enableColumnResizing
      enableSorting
      muiTableContainerProps={{
        sx: { maxHeight: '100%' },
      }}
    />
  );
};

export default Table;
