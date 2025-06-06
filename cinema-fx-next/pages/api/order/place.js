// pages/api/order/place.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email } = req.body;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userEmail: email },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    let status = 'SUCCESS';

    // Run the product stock update transaction
    const transaction = await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || product.stock < item.quantity) {
          status = 'FAIL';
          throw new Error(`Insufficient stock for product: ${product?.name}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
            inStock: product.stock - item.quantity > 0,
          },
        });
      }

      return tx;
    }).catch((error) => {
      status = 'FAIL';
      return null;
    });

    // Calculate total price
const totalPrice = cartItems.reduce(
  (sum, item) => sum + item.product.price * item.quantity,
  0
);

// Create the transaction first
const transactionRecord = await prisma.transaction.create({
  data: {
    username,
    email,
    status,
    totalPrice,
    products: {
      connect: cartItems.map((item) => ({ id: item.productId })),
    },
  },
});

// Create order items linked to the transaction
await prisma.$transaction(
  cartItems.map((item) =>
    prisma.orderItem.create({
      data: {
        transactionId: transactionRecord.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      },
    })
  )
);


    // Clear the cart regardless of transaction status
    await prisma.cartItem.deleteMany({
      where: { userEmail: email },
    });

    if (status === 'SUCCESS') {
  return res.status(200).json({ message: 'Order placed successfully!' });
} else {
  return res.status(400).json({
    message: 'Order failed due to insufficient stock. Clearing cart.',
  });
}
  } catch (error) {
    console.error('Order Placement Error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
}
