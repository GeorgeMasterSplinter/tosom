import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "./hash";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const valid = await verifyPassword(credentials.password, user.password);

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        (token as any).id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        (session.user as any).id = (token as any).id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret",
};
