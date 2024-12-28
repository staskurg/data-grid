import { sql } from '@vercel/postgres';
import { User, Row, TableSchema, Link } from '../../shared/types';

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

export const updateTableRow = async (
  tableId: string,
  rowId: string,
  columnKey: string,
  value: string | number | Link
): Promise<Row | null> => {
  const { rows: columns } = await sql`
    SELECT editable, accessor_key FROM columns 
    WHERE table_id = ${tableId}::uuid 
    AND accessor_key = ${columnKey}
  `;

  if (!columns[0]?.editable) {
    throw new Error('Column is not editable');
  }

  await sql`
    UPDATE table_rows 
    SET data = jsonb_set(
      data,
      array[${columnKey}],
      ${JSON.stringify(value)}::jsonb
    )
    WHERE id = ${rowId}::uuid 
    AND table_id = ${tableId}::uuid
  `;

  const { rows } = await sql`
    SELECT data FROM table_rows 
    WHERE id = ${rowId}::uuid 
    AND table_id = ${tableId}::uuid
  `;

  return rows[0]?.data || null;
};

export const updateRowUsers = async (
  tableId: string,
  rowId: string,
  columnKey: string,
  userIds: string[]
): Promise<Row | null> => {
  await sql`BEGIN`;

  try {
    // Verify column exists, is of type 'user', and is editable
    const { rows: columns } = await sql`
      SELECT type, editable FROM columns 
      WHERE table_id = ${tableId}::uuid 
      AND accessor_key = ${columnKey}
    `;

    if (!columns.length || columns[0].type !== 'user') {
      throw new Error('Invalid column type for user assignment');
    }

    if (!columns[0].editable) {
      throw new Error('Column is not editable');
    }

    // Remove existing user assignments
    await sql`
      DELETE FROM row_user_fields 
      WHERE row_id = ${rowId}::uuid 
      AND column_accessor_key = ${columnKey}
    `;

    // Insert new user assignments
    if (userIds.length > 0) {
      const values = userIds.map(userId => ({
        row_id: rowId,
        column_accessor_key: columnKey,
        user_id: userId,
      }));

      await sql`
        INSERT INTO row_user_fields (row_id, column_accessor_key, user_id)
        SELECT row_id::uuid, column_accessor_key, user_id::uuid
        FROM json_to_recordset(${JSON.stringify(values)})
        AS t(row_id text, column_accessor_key text, user_id text)
      `;
    }

    await sql`COMMIT`;

    // Return updated row data with user information
    const { rows } = await sql`
      SELECT 
        r.data,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'avatarUrl', u.avatar_url
          )
        ) FILTER (WHERE u.id IS NOT NULL) as users
      FROM table_rows r
      LEFT JOIN row_user_fields ruf ON r.id = ruf.row_id AND ruf.column_accessor_key = ${columnKey}
      LEFT JOIN users u ON ruf.user_id = u.id
      WHERE r.id = ${rowId}::uuid AND r.table_id = ${tableId}::uuid
      GROUP BY r.id, r.data
    `;

    if (!rows[0]) return null;

    const updatedRow = { ...rows[0].data };
    if (rows[0].users) {
      updatedRow[columnKey] = rows[0].users;
    }

    return updatedRow;
  } catch (error) {
    await sql`ROLLBACK`;
    throw error;
  }
};
