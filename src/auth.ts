import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
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
  providers: [Google, GitHub, Credentials({})],
  pages: {
    signIn: "/SignIn",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always redirect to home after login
      console.log(url, baseUrl);
      return baseUrl + "/";
    },
  },
});
