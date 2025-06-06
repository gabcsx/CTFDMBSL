import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: { in: ['SUCCESS', 'ONGOING'] },
      },
      include: {
        orderItems: {
          include: {
            product: true,  // Include the product info
          },
        },
      },
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
