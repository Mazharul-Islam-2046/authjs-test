import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { db } from "./lib/db";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [Google, GitHub, Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials, request) => {
      const userEmail = "pedro@PercentDiamond.com";
      const userPassword = "securepassword";

      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;

      if (email === userEmail && password === userPassword) {
        return {
          id: "1",
          name: "Pedro",
          email: userEmail,
        };
      }

      return null;
    }
  })],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow sign in
      return true;
    },
    async session({ session, token }) {
      // Add token data to session if needed
      return session;
    },
    async jwt({ token, user }) {
      // Persist the user data to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
