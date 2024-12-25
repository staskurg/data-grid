import { VercelRequest, VercelResponse } from '@vercel/node';
import { getUsers } from './utils/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const users = await getUsers();
      return res.status(200).json(users);
    }

    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET'],
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch users',
    });
  }
}
