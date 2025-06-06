import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const email = session.user.email;

  if (req.method === 'GET') {
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

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({
        username: user.username,
        email: user.email,
        address: user.address || '',
        phone: user.phone || '',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'PUT') {
    const { username, address, phone } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    try {
      await prisma.user.update({
        where: { email },
        data: {
          username,
          address: address || null,
          phone: phone || null,
        },
      });

      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
