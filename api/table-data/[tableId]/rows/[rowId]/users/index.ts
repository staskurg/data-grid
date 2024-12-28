import type { VercelRequest, VercelResponse } from '@vercel/node';
import { updateRowUsers } from '../../../../../utils/db';
import { User } from 'shared/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { tableId, rowId } = req.query;

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

    if (req.method !== 'PUT') {
      return res.status(405).json({
        error: 'Method not allowed',
        details: `Method ${req.method} is not supported for this endpoint`,
      });
    }

    const body = req.body;
    const columnKey = Object.keys(body)[0];
    const users = body[columnKey] as User[];

    if (!columnKey || !Array.isArray(users)) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: 'Request must include columnKey and users array',
      });
    }
    const userIds = users.map(user => user.id);
    const updatedRow = await updateRowUsers(tableId, rowId, columnKey, userIds);
    if (!updatedRow) {
      return res.status(404).json({
        error: 'Row not found',
        details: `No row found with ID: ${rowId}`,
      });
    }

    return res.status(200).json(updatedRow);
  } catch (error) {
    console.error('User assignment failed:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred while processing your request',
    });
  }
}
