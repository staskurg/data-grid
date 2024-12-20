import { VercelRequest, VercelResponse } from '@vercel/node';
import { getTable, updateTableRows } from '../utils/db';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { tableId } = req.query;

  if (!tableId || typeof tableId !== 'string') {
    return res.status(400).json({ error: 'Invalid table ID' });
  }

  if (req.method === 'GET') {
    const table = getTable(tableId);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    return res.status(200).json(table);
  }

  if (req.method === 'POST') {
    const { rows } = req.body;
    if (!rows) {
      return res.status(400).json({ error: 'Missing rows in request body' });
    }
    const updatedTable = updateTableRows(tableId, rows);
    if (!updatedTable) {
      return res.status(404).json({ error: 'Table not found' });
    }
    return res.status(200).json(updatedTable);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
