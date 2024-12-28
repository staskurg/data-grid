import type { VercelRequest, VercelResponse } from '@vercel/node';
import { updateTableRow } from '../../../../utils/db';

import type { Link } from 'shared/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { tableId, rowId } = req.query;
    const data = req.body;
    const [columnKey, value] = Object.entries(data)[0];

    if (
      !tableId ||
      typeof tableId !== 'string' ||
      !rowId ||
      typeof rowId !== 'string'
    ) {
      return res.status(400).json({
        error: 'Invalid parameters',
        details: 'Both table ID and row ID must be non-empty strings',
      });
    }

    const updatedRow = await updateTableRow(
      tableId,
      rowId,
      columnKey,
      value as string | number | Link
    );
    return res.status(200).json(updatedRow);
  } catch (error) {
    console.error('Row update failed:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred while processing your request',
    });
  }
}
