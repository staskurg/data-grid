import { sql } from '@vercel/postgres';
import { User, Row, TableSchema } from '../../shared/types';

export const getUsers = async (): Promise<User[]> => {
  const { rows: users } = await sql`SELECT * FROM users`;
  return users.map(user => ({
    ...user,
    avatarUrl: user.avatar_url,
  })) as User[];
};

export const getTable = async (
  tableId: string
): Promise<TableSchema | null> => {
  const { rows: tableRows } = await sql`
    SELECT
      t.id,
      c.id as column_id,
      c.accessor_key,
      c.type,
      c.label,
      c.editable,
      c."order",
      r.id as row_id,
      r.data,
      json_agg(
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email,
          'avatarUrl', u.avatar_url
        )
      ) FILTER (WHERE u.id IS NOT NULL) as users
    FROM tables t
    LEFT JOIN columns c ON t.id = c.table_id
    LEFT JOIN table_rows r ON t.id = r.table_id
    LEFT JOIN row_user_fields ruf ON r.id = ruf.row_id
    LEFT JOIN users u ON ruf.user_id = u.id
    WHERE t.id = ${tableId}::uuid
    GROUP BY t.id, c.id, r.id, r.data
  `;

  if (!tableRows.length) return null;

  const columns = tableRows
    .filter(
      (row, index, self) =>
        index === self.findIndex(r => r.column_id === row.column_id)
    )
    .map(row => ({
      id: row.column_id,
      accessorKey: row.accessor_key,
      type: row.type,
      label: row.label,
      editable: row.editable,
      order: row.order,
    }));

  const rows = tableRows
    .filter(
      (row, index, self) =>
        index === self.findIndex(r => r.row_id === row.row_id)
    )
    .map(row => {
      const data = { ...row.data };
      if (row.users) {
        columns.forEach(col => {
          if (col.type === 'user' && data[col.accessorKey]) {
            data[col.accessorKey] = row.users;
          }
        });
      }
      return data;
    });

  return {
    id: tableId,
    columns,
    rows,
  };
};

export const updateTableRows = async (
  tableId: string,
  rows: Row[]
): Promise<TableSchema | null> => {
  // Start transaction
  await sql`BEGIN`;

  try {
    // Update rows
    for (const row of rows) {
      await sql`
        UPDATE table_rows 
        SET data = ${JSON.stringify(row)}::jsonb
        WHERE id = ${row.id}::uuid AND table_id = ${tableId}::uuid
      `;
    }

    await sql`COMMIT`;
    return await getTable(tableId);
  } catch (error) {
    await sql`ROLLBACK`;
    throw error;
  }
};
