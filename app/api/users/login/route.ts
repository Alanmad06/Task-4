import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await signIn('credentials', body);

    // Si el inicio de sesión es exitoso, responde con un estado 200
    return new Response(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return new Response(JSON.stringify({ error: 'Invalid credentials.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        default:
          return new Response(JSON.stringify({ error: 'Something went wrong.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
      }
    }

    // Si ocurre un error inesperado, responde con un estado 500
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
