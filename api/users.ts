import type { VercelRequest, VercelResponse } from '@vercel/node';

type User = {
  id: number;
  name: string;
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    res.status(200).json(users);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
