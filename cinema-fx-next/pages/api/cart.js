import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const token = await getToken({ req });

  if (req.method === 'GET') {
    try {
      let cartItems;

      if (token?.email) {
        // Logged-in user
        cartItems = await prisma.cartItem.findMany({
          where: { userEmail: token.email },
          include: { product: true },
        });
      } else {
        // Anonymous user (fallback to sessionId)
        const sessionId = req.cookies.sessionId;
        cartItems = await prisma.cartItem.findMany({
          where: { sessionId },
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
