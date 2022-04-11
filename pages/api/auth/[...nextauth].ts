import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt"
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/auth/verify",
    newUser: "/auth/onboarding",
    signOut: "/login"
  },
  debug: true,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    })
  ]
});
