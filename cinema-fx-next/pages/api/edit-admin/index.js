import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { email } = req.query;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          username: true,
          email: true,
          address: true,
          phone: true,
        },
      });

      if (!user) return res.status(404).json({ error: 'User not found' });

      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
