import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TableSchema, User, Row } from '../../shared/types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1';

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

export const useUpdateTableData = (tableId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, Row[]>({
    mutationFn: rows =>
      fetchWrapper(`/table-data/${tableId}`, {
        method: 'POST',
        body: JSON.stringify({ rows }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tableData(tableId),
      });
    },
  });
};
