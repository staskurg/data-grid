import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTable, updateTableRows } from '../utils/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { tableId } = req.query;

    if (!tableId || typeof tableId !== 'string') {
      return res.status(400).json({ error: 'Invalid table ID' });
    }

    if (req.method === 'GET') {
      const table = await getTable(tableId);
      if (!table) {
        return res.status(404).json({ error: 'Table not found' });
      }
      return res.status(200).json(table);
    }

    if (req.method === 'POST') {
      const { rows } = req.body;
      if (!Array.isArray(rows)) {
        return res.status(400).json({ error: 'Invalid rows format' });
      }
      const updatedTable = await updateTableRows(tableId, rows);
      if (!updatedTable) {
        return res.status(404).json({ error: 'Table not found' });
      }
      return res.status(200).json(updatedTable);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Table operation failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
