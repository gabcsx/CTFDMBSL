import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, username, address, phone } = req.body;

  if (!email || !username) {
    return res.status(400).json({ message: 'Email and username are required' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        username,
        address,
        phone: phone,
      },
    });

    res.status(200).json({ message: 'User updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
