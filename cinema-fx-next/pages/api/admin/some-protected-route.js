// pages/api/admin/some-protected-route.js
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  return res.status(200).json({ message: "Admin access granted!" });
}
