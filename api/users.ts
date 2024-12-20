import { VercelRequest, VercelResponse } from '@vercel/node';
import { getUsers } from './utils/db';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(getUsers());
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
