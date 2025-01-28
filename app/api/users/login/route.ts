
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

const db = await createConnection();

export async function POST(request : Request) {
  try {
    const body = await request.json();
   await signIn('credentials', body);
    

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}