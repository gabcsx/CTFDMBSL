import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { purchaseDate: 'desc' },
    });

    // Format the response to match your UI structure
    const formatted = transactions.map((t) => ({
      id: t.id,
      username: t.username,
      email: t.email,
      items: t.orderItems.map((oi) => oi.product.name),
      totalPrice: t.totalPrice,
      purchaseDate: t.purchaseDate.toISOString().slice(0, 10),
      status: t.status,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to load transactions' });
  }
}