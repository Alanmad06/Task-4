import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { z } from "zod";
import { createConnection } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { User } from "@/lib/definitions";
import { Connection } from "mysql2/promise";

let db: Connection | undefined;


export async function getConnection(): Promise<Connection> {
  if (!db) {
    try {
      db = await createConnection();
    } catch (error) {
      console.error("Error al conectar con la base de datos:", error);
      throw new Error("Error al conectar con la base de datos.");
    }
  }
  return db;
}


async function getUser(email: string): Promise<User | undefined> {
  try {
    const db = await getConnection();
    const [results]: any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return results[0];
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw new Error("Error al obtener el usuario.");
  }
}

async function updateLastLogin(email: string): Promise<void> {
  try {
    const db = await getConnection();
    const query = "UPDATE users SET last_login = NOW() WHERE email = ?";
    await db.query(query, [email]);
  } catch (error) {
    console.error("Error al actualizar el último inicio de sesión:", error);
    throw new Error("Error al actualizar el último inicio de sesión.");
  }
}


async function getBlockedState(email: string): Promise<boolean> {
  try {
    const db = await getConnection();
    const query = "SELECT blocked FROM users WHERE email = ?";
    const [results]: any = await db.query(query, [email]);

    if (results.length === 0) {
      throw new Error("Usuario no encontrado.");
    }

    return Boolean(results[0].blocked);
  } catch (error) {
    console.error("Error al verificar el estado de bloqueo:", error);
    throw new Error("Error al verificar el estado de bloqueo.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(1) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.error("Credenciales inválidas:", parsedCredentials.error);
          return null;
        }

        const { email, password } = parsedCredentials.data;

        try {
          
          const user = await getUser(email);
          if (!user) {
            console.error("Usuario no encontrado.");
            return null;
          }

          
          const isPasswordValid = await bcrypt.compare(password, user.password!);
          if (!isPasswordValid) {
            console.error("Contraseña incorrecta.");
            return null;
          }

      
          await updateLastLogin(email);

      
          const isBlocked = await getBlockedState(email);
          if (isBlocked) {
            console.error("Usuario bloqueado.");
            return null;
          }

          return {id: user.id, email: user.email};
        } catch (error) {
          console.error("Error durante la autorización:", error);
          return null;
        }
      },
    }),
  ],
  callbacks :{
     jwt({ token, user }) {
      if (user) {
        token.id = user.id; 
      }
      return token;
    },
     session({ session, token }) {
      
      session.user.id = token.id as string;
      
      return session;
    },
   
  }
});
