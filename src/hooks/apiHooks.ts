import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  TableSchema,
  User,
  Row,
  RowUpdate,
  UserAssignmentUpdate,
} from 'shared/types';

const API_BASE_URL = '/api/v1';

const QUERY_KEYS = {
  tableData: (id: string) => ['tableData', id] as const,
  users: ['users'] as const,
};

const fetchWrapper = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

export const useTableData = (tableId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.tableData(tableId),
    queryFn: () => fetchWrapper<TableSchema>(`/table-data/${tableId}`),
  });

export const useUsers = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: () => fetchWrapper<User[]>('/users'),
    enabled: options?.enabled,
  });

export const useUpdateTableRow = (tableId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Row, Error, RowUpdate, { previousData: TableSchema }>({
    mutationFn: ({ rowId, columnKey, value }) =>
      fetchWrapper(`/table-data/${tableId}/rows/${rowId}`, {
        method: 'PUT',
        body: JSON.stringify({ [columnKey]: value }),
      }),

    onMutate: async newUpdate => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.tableData(tableId),
      });
      const previousData = queryClient.getQueryData<TableSchema>(
        QUERY_KEYS.tableData(tableId)
      )!;

      queryClient.setQueryData(
        QUERY_KEYS.tableData(tableId),
        (old: TableSchema) => ({
          ...old,
          rows: old.rows.map(row =>
            row.id === newUpdate.rowId
              ? { ...row, [newUpdate.columnKey]: newUpdate.value }
              : row
          ),
        })
      );

      return { previousData };
    },

    onError: (err, newUpdate, context) => {
      if (context) {
        queryClient.setQueryData(
          QUERY_KEYS.tableData(tableId),
          context.previousData
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tableData(tableId),
      });
    },
  });
};

export const useUpdateRowUsers = (tableId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    Row,
    Error,
    UserAssignmentUpdate,
    { previousData: TableSchema }
  >({
    mutationFn: ({ rowId, columnKey, value }) =>
      fetchWrapper(`/table-data/${tableId}/rows/${rowId}/users`, {
        method: 'PUT',
        body: JSON.stringify({ [columnKey]: value }),
      }),

    onMutate: async newUpdate => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.tableData(tableId),
      });
      const previousData = queryClient.getQueryData<TableSchema>(
        QUERY_KEYS.tableData(tableId)
      )!;

      queryClient.setQueryData(
        QUERY_KEYS.tableData(tableId),
        (old: TableSchema) => ({
          ...old,
          rows: old.rows.map(row =>
            row.id === newUpdate.rowId
              ? { ...row, [newUpdate.columnKey]: newUpdate.value }
              : row
          ),
        })
      );

      return { previousData };
    },

    onError: (err, newUpdate, context) => {
      if (context) {
        queryClient.setQueryData(
          QUERY_KEYS.tableData(tableId),
          context.previousData
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tableData(tableId),
      });
    },
  });
};
