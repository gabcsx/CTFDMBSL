import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const token = await getToken({ req });

  if (req.method === 'GET') {
    try {
      let cartItems;

      // Try to get sessionId from query first, then fallback to cookies
      const sessionId = req.query.sessionId || req.cookies.sessionId;

      if (token?.email) {
        // --- MIGRATION LOGIC: Move guest cart items to user on first fetch after login ---
        if (sessionId) {
          const guestCartItems = await prisma.cartItem.findMany({
            where: { sessionId, userEmail: null },
          });

          for (const item of guestCartItems) {
            // Check if user already has this product in their cart
            const userCartItem = await prisma.cartItem.findFirst({
              where: {
                userEmail: token.email,
                productId: item.productId,
              },
            });

            if (userCartItem) {
              // Merge quantities
              await prisma.cartItem.update({
                where: { id: userCartItem.id },
                data: { quantity: userCartItem.quantity + item.quantity },
              });
              // Delete guest item
              await prisma.cartItem.delete({ where: { id: item.id } });
            } else {
              // Assign guest cart item to this user
              await prisma.cartItem.update({
                where: { id: item.id },
                data: { userEmail: token.email },
              });
            }
          }
        }

        // Now fetch the user's cart
        cartItems = await prisma.cartItem.findMany({
          where: { userEmail: token.email },
          include: { product: true },
        });
      } else {
        // Anonymous user (guest)
        if (!sessionId) {
          return res.status(400).json({ error: 'Missing sessionId' });
        }
        cartItems = await prisma.cartItem.findMany({
          where: { sessionId: sessionId, userEmail: null },
          include: { product: true },
        });
      }

      res.status(200).json(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  }
}
// new