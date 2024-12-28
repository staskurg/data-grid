import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTable } from '../../utils/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { tableId } = req.query;

    if (!tableId || typeof tableId !== 'string') {
      return res.status(400).json({
        error: 'Invalid table ID',
        details: 'Table ID must be a non-empty string',
      });
    }

    if (req.method !== 'GET') {
      return res.status(405).json({
        error: 'Method not allowed',
        details: `Method ${req.method} is not supported for this endpoint`,
      });
    }

    const table = await getTable(tableId);
    if (!table) {
      return res.status(404).json({
        error: 'Table not found',
        details: `No table found with ID: ${tableId}`,
      });
    }

    return res.status(200).json(table);
  } catch (error) {
    console.error('Table operation failed:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred while processing your request',
    });
  }
}
