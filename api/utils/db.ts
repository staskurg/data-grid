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
  const { rows } = await sql`
    WITH user_data AS (
      SELECT 
        ruf.row_id,
        ruf.column_accessor_key,
        jsonb_agg(
          jsonb_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'avatarUrl', u.avatar_url
          )
        ) as users
      FROM row_user_fields ruf
      JOIN users u ON ruf.user_id = u.id
      GROUP BY ruf.row_id, ruf.column_accessor_key
    ),
    user_columns AS (
      SELECT DISTINCT accessor_key
      FROM columns
      WHERE table_id = ${tableId}::uuid
      AND type = 'user'
    )
    SELECT
      t.id as table_id,
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', c2.id,
            'accessorKey', c2.accessor_key,
            'type', c2.type,
            'label', c2.label,
            'editable', c2.editable,
            'order', c2."order"
          )
        )
        FROM (
          SELECT DISTINCT ON (c2.id) c2.*
          FROM columns c2
          WHERE c2.table_id = t.id
          ORDER BY c2.id, c2."order"
        ) c2
      ) as columns,
      jsonb_agg(DISTINCT
        jsonb_build_object(
          'id', r.id,
          'data', r.data || (
            SELECT jsonb_object_agg(
              uc.accessor_key,
              COALESCE(
                (SELECT users FROM user_data ud WHERE ud.row_id = r.id AND ud.column_accessor_key = uc.accessor_key),
                '[]'::jsonb
              )
            )
            FROM user_columns uc
          )
        )
      ) as rows
    FROM tables t
    JOIN columns c ON t.id = c.table_id
    JOIN table_rows r ON t.id = r.table_id
    WHERE t.id = ${tableId}::uuid
    GROUP BY t.id
  `;

  if (!rows.length) return null;

  const result = rows[0];
  return {
    id: result.table_id,
    columns: result.columns,
    rows: result.rows.map((row: { id: string; data: Row }) => row.data),
  };
};

export const updateTableRow = async (
  tableId: string,
  rowId: string,
  columnKey: string,
  value: string | number | Link
): Promise<Row | null> => {
  // First verify column exists and is editable
  const { rows: columns } = await sql`
    SELECT type, editable FROM columns 
    WHERE table_id = ${tableId}::uuid 
    AND accessor_key = ${columnKey}
  `;

  if (!columns[0]?.editable) {
    throw new Error('Column is not editable');
  }

  // Validate value type matches column type
  const columnType = columns[0].type;
  if (columnType === 'number' && typeof value !== 'number') {
    throw new Error('Invalid value type for number column');
  }
  if (columnType === 'link' && typeof value === 'object') {
    const linkValue = value as Link;
    if (!linkValue.url || !linkValue.value) {
      throw new Error('Invalid link structure');
    }
  }

  // Update the row with new value
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

  // Return updated row data
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
    // Validate column type and editability
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

    // Remove existing assignments
    await sql`
      DELETE FROM row_user_fields 
      WHERE row_id = ${rowId}::uuid 
      AND column_accessor_key = ${columnKey}
    `;

    // Add new assignments
    if (userIds.length > 0) {
      for (const userId of userIds) {
        await sql`
          INSERT INTO row_user_fields (row_id, column_accessor_key, user_id)
          VALUES (${rowId}::uuid, ${columnKey}, ${userId}::uuid)
        `;
      }
    }

    // Get updated row data with user information
    const { rows } = await sql`
    SELECT 
      r.data || ('{"' || ${columnKey} || '":' || 
        COALESCE(
          (
            SELECT to_json(array_agg(
              json_build_object(
                'id', u.id,
                'name', u.name,
                'email', u.email,
                'avatarUrl', u.avatar_url
              )
            ))::text
            FROM row_user_fields ruf
            JOIN users u ON ruf.user_id = u.id
            WHERE ruf.row_id = r.id
            AND ruf.column_accessor_key = ${columnKey}
          ),
          '[]'
        ) || '}')::jsonb as data
    FROM table_rows r
    WHERE r.id = ${rowId}::uuid 
    AND r.table_id = ${tableId}::uuid
  `;

    await sql`COMMIT`;
    return rows[0]?.data || null;
  } catch (error) {
    await sql`ROLLBACK`;
    throw error;
  }
};
