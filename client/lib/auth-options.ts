import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "./mongoose";
import UserModel from "@/models/user.model";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await UserModel.findOne({ email: credentials?.email });
        return user;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectToDatabase();
      const existUser = await UserModel.findOne({ email: session.user?.email });
      if (!existUser) {
        const newUser = await UserModel.create({
          email: session.user?.email,
          isVerified: true,
          avatar: session.user?.image,
        });

        session.currentUser = newUser;
        return session;
      }

      session.currentUser = existUser;
      return session;
    },
  },

  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXT_PUBLIC_JWT_SECRET },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/auth", signOut: "/auth" },
};
