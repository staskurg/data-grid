import { sql } from '@vercel/postgres';
import { readFile } from 'fs/promises';

const loadData = async () => {
  const data = JSON.parse(
    await readFile(new URL('./mock-data.json', import.meta.url))
  );
  return data;
};

async function resetDatabase() {
  await sql`
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = current_database()
    AND pid <> pg_backend_pid();
  `;

  await sql`DROP SCHEMA public CASCADE`;
  await sql`CREATE SCHEMA public`;
}

async function createTables() {
  // Create users table
  await sql`
    CREATE TABLE users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      avatar_url TEXT
    )
  `;

  // Create tables table
  await sql`
    CREATE TABLE tables (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL
    )
  `;

  // Create columns table
  await sql`
    CREATE TABLE columns (
      id UUID PRIMARY KEY,
      table_id UUID REFERENCES tables(id),
      accessor_key TEXT NOT NULL,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      editable BOOLEAN DEFAULT false,
      "order" INTEGER NOT NULL,
      CONSTRAINT valid_type CHECK (type IN ('link', 'user', 'number', 'text', 'tag')),
      UNIQUE (table_id, accessor_key)
    )
  `;

  // Create validation function
  await sql`
  CREATE OR REPLACE FUNCTION validate_row_data(target_table_id UUID, row_data JSONB)
  RETURNS BOOLEAN AS $$
  DECLARE
    column_record RECORD;
  BEGIN
    FOR column_record IN SELECT accessor_key, type FROM columns WHERE table_id = target_table_id
    LOOP
      IF column_record.type != 'user' AND NOT row_data ? column_record.accessor_key THEN
        RETURN FALSE;
      END IF;
      
      CASE column_record.type
        WHEN 'number' THEN
          IF jsonb_typeof(row_data->column_record.accessor_key) != 'number' THEN
            RETURN FALSE;
          END IF;
        WHEN 'link' THEN
          IF NOT (
            jsonb_typeof(row_data->column_record.accessor_key) = 'object' AND
            (row_data->column_record.accessor_key) ? 'url' AND
            (row_data->column_record.accessor_key) ? 'value'
          ) THEN
            RETURN FALSE;
          END IF;
        ELSE
          -- Other types don't need validation
          NULL;
      END CASE;
    END LOOP;
    
    RETURN TRUE;
  END;
  $$ LANGUAGE plpgsql;
`;

  // Create table_rows table with validation
  await sql`
    CREATE TABLE table_rows (
      id UUID PRIMARY KEY,
      table_id UUID REFERENCES tables(id),
      data JSONB NOT NULL,
      CONSTRAINT validate_row_schema CHECK (
        jsonb_typeof(data) = 'object' AND
        validate_row_data(table_id, data)
      )
    )
  `;

  // Create row_user_fields table
  await sql`
    CREATE TABLE row_user_fields (
      row_id UUID REFERENCES table_rows(id),
      column_accessor_key TEXT NOT NULL,
      user_id UUID REFERENCES users(id),
      PRIMARY KEY (row_id, column_accessor_key, user_id)
    )
  `;
}

async function seedData() {
  const data = await loadData();

  // Insert users
  for (const user of data.users) {
    await sql`
      INSERT INTO users (id, name, email, avatar_url)
      VALUES (${user.id}::uuid, ${user.name}, ${user.email}, ${user.avatarUrl})
    `;
  }

  // Insert tables and their data
  for (const table of data.tables) {
    // Insert table
    await sql`
      INSERT INTO tables (id, name)
      VALUES (${table.id}::uuid, ${table.id})
    `;

    // Insert columns
    for (const column of table.columns) {
      await sql`
        INSERT INTO columns (id, table_id, accessor_key, type, label, editable, "order")
        VALUES (
          ${column.id}::uuid, 
          ${table.id}::uuid, 
          ${column.accessorKey}, 
          ${column.type}, 
          ${column.label}, 
          ${column.editable}, 
          ${column.order}
        )
      `;
    }

    // Insert rows and user relationships
    for (const row of table.rows) {
      await sql`
        INSERT INTO table_rows (id, table_id, data)
        VALUES (${row.id}::uuid, ${table.id}::uuid, ${JSON.stringify(row)}::jsonb)
      `;

      // Insert user relationships
      for (const column of table.columns) {
        if (column.type === 'user' && row[column.accessorKey]) {
          for (const userId of row[column.accessorKey]) {
            await sql`
              INSERT INTO row_user_fields (row_id, column_accessor_key, user_id)
              VALUES (${row.id}::uuid, ${column.accessorKey}, ${userId}::uuid)
            `;
          }
        }
      }
    }
  }
}

async function setupDatabase() {
  await resetDatabase();
  await createTables();
  await seedData();
  console.log('Database setup completed successfully');
}

setupDatabase().catch(console.error);
