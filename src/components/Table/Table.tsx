import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import {
  Column,
  Row,
  User,
  Link,
  ColumnType,
  CellValue,
} from '../../../shared/types';

interface TableProps {
  columns: Column[];
  rows: Row[];
  onRowsChange: (newRows: Row[]) => void;
}

const renderCell = (type: ColumnType, value: CellValue) => {
  switch (type) {
    case 'link':
      return value ? (
        <a href={(value as Link).url} target="_blank" rel="noopener noreferrer">
          {(value as Link).value}
        </a>
      ) : null;

    case 'user':
      return (value as User[])?.map(user => (
        <div key={user.id} style={{ display: 'flex', gap: '4px' }}>
          <img
            src={user.avatarUrl}
            alt={user.email}
            style={{ width: 24, height: 24, borderRadius: '50%' }}
          />
          <span>{user.email}</span>
        </div>
      ));

    case 'number':
      return <span>{value as number}</span>;

    case 'tag':
      return (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: '#e0e0e0',
          }}
        >
          {value as string}
        </span>
      );

    default:
      return <span>{value as string}</span>;
  }
};

const Table = ({ columns, rows, onRowsChange }: TableProps) => {
  const tableColumns = useMemo<MRT_ColumnDef<Row>[]>(
    () =>
      columns.map(col => ({
        accessorKey: col.accessorKey,
        header: col.label,
        enableEditing: col.editable,
        Cell: ({ cell }) => renderCell(col.type, cell.getValue() as CellValue),
      })),
    [columns]
  );

  return (
    <MaterialReactTable
      columns={tableColumns}
      data={rows}
      enableEditing
      enableRowSelection
      enableColumnResizing
      enableSorting
      muiTableContainerProps={{
        sx: { maxHeight: '100%' },
      }}
      onEditingRowSave={({ row, values }) => {
        const updatedRows = rows.map((oldRow, index) =>
          index === row.index ? values : oldRow
        );
        onRowsChange(updatedRows);
      }}
    />
  );
};

export default Table;
