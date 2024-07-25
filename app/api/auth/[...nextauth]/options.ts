import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

interface CustomSession extends DefaultSession {
  user: {
    id: string;
    email: string;
    token: string;
  } & DefaultSession["user"];
}

interface CustomUser {
  id: string;
  email: string;
  token: string;
}

interface CustomJWT extends JWT {
  id?: string;
  email?: string;
  token?: string;
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
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;

          if (user) {
            const token = await user.getIdToken();
            return {
              id: user.uid,
              email: user.email || "",
              token,
            };
          } else {
            console.error("Authorization failed: No user data");
            return null;
          }
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
        token.token = (user as CustomUser).token || "";
      }
      return token as CustomJWT;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email || "",
        token: token.token || "",
      } as any;
      return session as CustomSession;
    },
  },
};
