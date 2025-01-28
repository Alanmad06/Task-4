

import UsersTable from "@/components/usersTable";


export default function Users() {
  

  
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl text-black">Users</h1>
            <UsersTable  />      
        </div>
    );
}