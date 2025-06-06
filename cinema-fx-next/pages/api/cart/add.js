import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // adjust this path if needed
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  const userEmail = session?.user?.email || null;

  const { sessionId, productId, quantity } = req.body;

  if (!sessionId || !productId || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const existing = await prisma.cartItem.findFirst({
    where: { sessionId, productId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + quantity,
        userEmail: userEmail || undefined, // update if available
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        sessionId,
        productId,
        quantity,
        userEmail,
      },
    });
  }

  return res.status(200).json({ message: 'Item added to cart' });
}
