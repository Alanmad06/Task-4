import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks :{
    authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        const isOnUsers = nextUrl.pathname.startsWith('/users');
        if (isOnUsers) {
          if (isLoggedIn) return true;
          return false; 
        } else if (isLoggedIn) {
          return Response.redirect(new URL('/users', nextUrl));
        }
        return true;
      },
  },
  providers :[]
} satisfies NextAuthConfig;