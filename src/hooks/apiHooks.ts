import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TableSchema, User, Row } from '../../shared/types';

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

export const useUsers = () =>
  useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: () => fetchWrapper<User[]>('/users'),
  });

/**
 * Hook for updating table data with optimistic updates
 * @param tableId - Unique identifier for the table
 * @returns Mutation object for updating table data
 */
export const useUpdateTableData = (tableId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, Row[], { previousData: TableSchema }>({
    // Send updated rows to the server
    mutationFn: rows =>
      fetchWrapper(`/table-data/${tableId}`, {
        method: 'POST',
        body: JSON.stringify({ rows }),
      }),

    // Optimistically update UI before server response
    onMutate: async newRows => {
      // Cancel any in-flight refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.tableData(tableId),
      });

      // Snapshot current table data for potential rollback
      const previousData = queryClient.getQueryData<TableSchema>(
        QUERY_KEYS.tableData(tableId)
      )!;

      // Update table data immediately in cache
      queryClient.setQueryData(
        QUERY_KEYS.tableData(tableId),
        (old: TableSchema) => ({
          ...old,
          rows: newRows,
        })
      );

      // Return snapshot for rollback in case of error
      return { previousData };
    },

    // Rollback to previous state if mutation fails
    onError: (err, newRows, context) => {
      if (context) {
        queryClient.setQueryData(
          QUERY_KEYS.tableData(tableId),
          context.previousData
        );
      }
    },

    // Refetch data after mutation to ensure cache consistency
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tableData(tableId),
      });
    },
  });
};
