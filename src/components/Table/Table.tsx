import { useMemo } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { getCellRenderer } from './CellRenderers';
import { getCellEditor } from './CellEditors';

import type { Row, CellValue, TableSchema } from '../../../shared/types';

type TableProps = {
  tableData: TableSchema | undefined;
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
  onRowsChange: (newRows: Row[]) => void;
};

const Table = ({
  tableData,
  isLoading,
  isSaving,
  onRowsChange,
  error,
}: TableProps) => {
  const { columns = [], rows = [] } = tableData || {};
  const tableColumns = useMemo<MRT_ColumnDef<Row>[]>(
    () =>
      columns.map(col => ({
        accessorKey: col.accessorKey,
        header: col.label,
        enableEditing: col.editable,
        Cell: ({ column, cell, table }) => {
          return getCellRenderer({
            type: col.type,
            value: cell.getValue() as CellValue,
            columnWidth: column.getSize(),
            isEditable: col.editable,
            onEditStart: () => table.setEditingCell(cell),
          });
        },
        Edit: ({ column, cell, table }) => {
          const handleEditComplete = (newValue: CellValue) => {
            const updatedRows = rows.map(row => {
              if (row.id === cell.row.original.id) {
                return { ...row, [column.id]: newValue };
              }
              return row;
            });
            onRowsChange(updatedRows);
            table.setEditingCell(null);
          };

          const handleEditCancel = () => {
            table.setEditingCell(null);
          };

          return (
            <div>
              {getCellEditor({
                type: col.type,
                initialValue: cell.getValue() as CellValue,
                onComplete: handleEditComplete,
                onCancel: handleEditCancel,
              })}
            </div>
          );
        },
      })),
    [columns, onRowsChange, rows]
  );

  return (
    <MaterialReactTable
      columns={tableColumns}
      data={rows}
      enableEditing
      editDisplayMode="cell"
      enableRowSelection
      enableColumnResizing
      enableSorting
      enablePagination={false}
      enableToolbarInternalActions={false}
      muiTableContainerProps={{
        sx: { maxHeight: '100%' },
      }}
      muiToolbarAlertBannerProps={
        error
          ? {
              color: 'error',
              children: error.message,
            }
          : undefined
      }
      state={{
        density: 'compact',
        isLoading: isLoading,
        isSaving: isSaving,
        showAlertBanner: !!error,
      }}
    />
  );
};
export default Table;
