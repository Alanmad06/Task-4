import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import { z } from 'zod';
import { createConnection } from '@/lib/db'; 
import bcrypt from 'bcryptjs';
import type { User } from '@/lib/definitions';
import {Connection} from 'mysql2/promise';

let db : Connection | undefined;

export async function getConnection(){

    if(!db){
        db = await createConnection();
    }
    return db;
}

async function getUser(email: string): Promise<User | undefined> {
  try {
    const [results] : any = await db!.query('SELECT * FROM users WHERE email = ?', [email]);
    return results[0]; 
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw new Error('Error al obtener el usuario.');
  }
}

async function updateLastLogin(email: string): Promise<void> {
    try {
        const query = 'UPDATE users SET last_login = NOW() WHERE email = ?';
        await db!.query(query, [email]);
    } catch (error) {
        console.error('Error al actualizar el último inicio de sesión:', error);
        throw new Error('Error al actualizar el último inicio de sesión.');
    }
}

async function getBlockedState(email: string): Promise<boolean> {
    try {
        const query = 'SELECT blocked FROM users WHERE email = (?)';
        const [result]:any = await db!.query(query,[email])
        
        return result[0].blocked
    } catch (error) {
        console.error('Error al actualizar el último inicio de sesión:', error);
        throw new Error('Error al actualizar el último inicio de sesión.');
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

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user : User | undefined = await getUser(email);

          if (!user) {
            return null; 
          }

         
          const isPasswordValid = await bcrypt.compare(password, user.password!);
          if (!isPasswordValid) {
            return null;
          }

          await updateLastLogin(email)
         const isBlocked = await getBlockedState(email)
         
         if(isBlocked){
            return null
         }
          return user; 
        }

        return null; 
      },
    }),
  ],
});

db = await getConnection()