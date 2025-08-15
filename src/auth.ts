import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
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
