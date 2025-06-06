import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        // Validate password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password.");
        }

        // Return user info (will be encoded into JWT)
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
callbacks: {
  async jwt({ token, user }) {
    // On initial login, user object is available — save data in token
    if (user) {
      token.id = user.id;
      token.email = user.email;
      token.username = user.username;
      token.role = user.role;
    } else {
      // On subsequent requests, fetch fresh user data from DB using token.id
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { username: true, email: true, role: true },
        });
        if (dbUser) {
          token.username = dbUser.username;
          token.email = dbUser.email;
          token.role = dbUser.role;
        }
      }
    }
    return token;
  },

  async session({ session, token }) {
    // Add updated token data to session.user
    if (token) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.username = token.username;
      session.user.role = token.role;
    }
    return session;
  },
},
  pages: {
    signIn: "/login", // Customize this if you have a login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
