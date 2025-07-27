// pages/api/order-latest.js
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const latestOrder = await prisma.transaction.findFirst({
      where: {
        email: session.user.email,
        status: 'SUCCESS',
      },
      orderBy: {
        purchaseDate: 'desc',
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!latestOrder) {
      return res.status(404).json({ message: 'No orders found' });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const items = latestOrder.orderItems.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price,
    }));

    res.status(200).json({
      username: latestOrder.username,
      email: latestOrder.email,
      purchaseDate: latestOrder.purchaseDate,
      phone: user?.phone || null,
      address: user?.address || null,
      totalPrice: latestOrder.totalPrice,
      items,
    });
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
