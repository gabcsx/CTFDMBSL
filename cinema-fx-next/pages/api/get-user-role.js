import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json({ role: user.role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
}
