import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const runtime = "edge";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        return null;
      },
    }),
  ],
};
