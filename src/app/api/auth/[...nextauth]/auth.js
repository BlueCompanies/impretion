import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { getUser, insertUser } from "@/app/_lib/userProfiles";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  session: { strategy: "jwt" }, // force JWT session with a database
  callbacks: {
    async session({ session }) {
      return session;
    },

    async signIn({ profile }) {
      console.log(profile.email);
      const userExists = await getUser(profile.email || null);
      const { document } = userExists;

      if (!document) {
        const newUser = await insertUser(profile.email, profile.name);
      }
      return profile;
    },
  },
});