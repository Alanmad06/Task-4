import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import { z } from 'zod';
import { createConnection } from '@/lib/db'; // Conexión a MySQL
import bcrypt from 'bcryptjs';
import type { User } from '@/lib/definitions';

const db = await createConnection();
// Función para obtener el usuario desde la base de datos
async function getUser(email: string): Promise<User | undefined> {
  try {
    const [results] : any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return results[0]; // Devuelve el primer usuario encontrado
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw new Error('Error al obtener el usuario.');
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
            return null; // Si no hay usuario, no permitimos el inicio de sesión
          }

          // Comprobamos la contraseña con bcrypt
          const isPasswordValid = await bcrypt.compare(password, user.password!);
          if (!isPasswordValid) {
            return null; // Si la contraseña no coincide, no permitimos el inicio de sesión
          }

          return user; // Devolvemos el usuario si todo es válido
        }

        return null; // Si no pasa la validación de zod, no permitimos el inicio de sesión
      },
    }),
  ],
});
