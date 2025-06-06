import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { itemId, removeQty } = req.body;

  if (!itemId) {
  return res.status(400).json({ message: 'Item ID is required' });
}

  const id = typeof itemId === 'string' ? parseInt(itemId) : itemId;

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (!removeQty || removeQty <= 0 || removeQty >= cartItem.quantity) {
  // Remove all
  await prisma.cartItem.delete({
    where: { id },
  });
} else {
  const newQty = cartItem.quantity - removeQty;

  await prisma.cartItem.update({
    where: { id },
    data: { quantity: newQty },
  });
}

    return res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ message: 'Server error', details: error.message });
  }
}
