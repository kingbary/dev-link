import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const baseUrl = process.env.NEXT_PUBLIC_BASEURL;
        try {
          const res = await axios.post(
            `${baseUrl}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const { token, ...user } = res.data;

          if (res.status === 200 && user) {
            return { ...user, token };
          } else {
            console.error(
              "Authorization failed: Invalid status or no admin data"
            );
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
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};
