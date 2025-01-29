

import UsersTable from "@/components/usersTable";
import { signOut } from '@/auth';

export default function Users() {
  

  
    return (
        <div className="flex flex-col p-5 items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl text-black">Users</h1>
            <form className="absolute top-1 right-1"
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-500 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
         
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
            <UsersTable  />      
        </div>
    );
}