import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { db } from "./lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
  interface User {
    role?: string | null;
  }
}

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
      console.log("🔴 authorize() - INPUT:", { credentials });
      
      // Example user database - in production, query from database
      const users = [
        {
          email: "pedro@PercentDiamond.com",
          password: "securepassword",
          id: "1",
          name: "Pedro",
          role: "ADMIN"
        },
        {
          email: "user@example.com",
          password: "password123",
          id: "2",
          name: "Regular User",
          role: "USER"
        }
      ];

      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;

      console.log("🔴 authorize() - Validating credentials...", { email, password });

      const user = users.find(u => u.email === email && u.password === password);

      

      if (user) {
        const userObj = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        console.log("🔴 authorize() - SUCCESS:", userObj);
        return userObj;
      }

      console.log("🔴 authorize() - FAILED: Invalid credentials");
      return null;
    }
  })],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow sign in
      console.log("🔵 signIn callback - INPUT:", { user, account, profile });
      
      // Create or update user in database if using Credentials provider
      if (account?.provider === "credentials" && user.email) {
        console.log("🔵 Creating/updating user in database for Credentials provider...");
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email as string },
          });
          
          if (!existingUser) {
            const newUser = await db.user.create({
              data: {
                email: user.email as string,
                name: user.name as string,
                emailVerified: new Date(),
                role: user.role as any || "USER",
              },
            });
            console.log("🔵 Created new user:", newUser);
            user.id = newUser.id;
          } else {
            console.log("🔵 User already exists:", existingUser);
            user.id = existingUser.id;
            // Update role if it changed
            if (user.role && existingUser.role !== user.role) {
              await db.user.update({
                where: { id: existingUser.id },
                data: { role: user.role as any },
              });
            }
          }
        } catch (error) {
          console.error("🔵 Error creating user:", error);
        }
      }
      
      console.log("🔵 signIn callback - RETURNING: true");
      return true;
    },
    async session({ session, token }) {
      // Add token data to session
      console.log("🟢 session callback - INPUT:", { session, token });
      
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      
      console.log("🟢 session callback - OUTPUT:", session);
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // Persist the user data to the token
      console.log("🟡 jwt callback - INPUT:", { token, user, trigger, session });
      
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      // Handle role updates from client
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      
      console.log("🟡 jwt callback - OUTPUT:", token);
      return token;
    },
  },
});
