import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id } = req.body;
    try {
      const updated = await prisma.transaction.update({
        where: { id },
        data: { status: 'ONGOING' },
      });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
