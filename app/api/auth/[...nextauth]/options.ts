import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

interface CustomSession extends DefaultSession {
  user: {
    id: string;
    email: string;
  } & DefaultSession["user"];
}

interface CustomUser {
  id: string;
  email: string;
}

interface CustomJWT extends JWT {
  id?: string;
  email?: string;
}

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const { email, password } = credentials;

        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.error("Authorization failed: User not found");
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            console.error("Authorization failed: Invalid password");
            return null;
          }

          return {
            id: user.id,
            email: user.email,
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as CustomUser).id;
        token.email = (user as CustomUser).email || "";
      }
      return token as CustomJWT;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email || "",
      } as any;
      return session as CustomSession;
    },
  },
};
