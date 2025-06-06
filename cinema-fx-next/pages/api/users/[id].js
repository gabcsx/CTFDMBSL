import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const userId = parseInt(req.query.id);

  if (req.method === 'DELETE') {
    try {
      await prisma.user.delete({ where: { id: userId } });
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } else if (req.method === 'PUT') {
    // Update role
    try {
      const { role } = req.body;
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
