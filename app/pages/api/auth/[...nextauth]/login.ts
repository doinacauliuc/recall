import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Log In",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email e password sono obbligatori");
          }
      
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
      
          if (!user) {
            throw new Error("Utente non trovato");
          }
      
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordMatch) {
            throw new Error("Password errata");
          }
      
          return {
            id: user.Id,
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Errore di autenticazione");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Reindirizza alla pagina di login personalizzata
  },
};

export default NextAuth(authOptions);
