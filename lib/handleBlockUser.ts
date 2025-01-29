"use server"; 

import { signOut } from "@/auth";
import getSession from "./getSession";

export async function handleBlockUser(selectedUsers: string[]) {
    const user = await getSession(); 

    if (user && selectedUsers.includes(user.id!)) {
        await signOut({ redirectTo: "/login" }); 
    }
}