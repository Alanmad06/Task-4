"use client"

import { useEffect, useState } from 'react';
import { User } from '@/lib/definitions';
import BlockButton from './buttons/blockButton';
import UnblockButton from './buttons/unblockButton';
import DeleteButton from './buttons/deleteButton';
import { Lock, Unlock } from "lucide-react";

export default function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectUser = (userid: string) => {
        setSelectedUsers((prevSelected: string[]) =>
            prevSelected.includes(userid)
                ? prevSelected.filter((id) => userid !== id)
                : [...prevSelected, userid]
        );
    };

    useEffect(() => {
        fetch('/api/users')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUsers(data);
            })
            .catch((error) => console.error('Error al obtener usuarios:', error));
    }, []);

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map((user) => user.id));
        }
        setSelectAll(!selectAll);
    };

    return (
        <div className="flex flex-col items-center m-10 justify-center max-h-screen bg-gray-100">
            <div className="flex gap-2 items-center justify-center">
                <BlockButton selectedUsers={selectedUsers} setUsers={setUsers}/>
                <UnblockButton selectedUsers={selectedUsers} setUsers={setUsers}/>
                <DeleteButton selectedUsers={selectedUsers} setUsers={setUsers} />
            </div>
            <table className="bg-white p-6 rounded shadow-md w-full max-w-md text-black">
                <thead>
                    <tr>
                        <th className="border p-2">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th className="border p-2">Blocked</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Last Seen</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.email}>
                            <td className="border p-2">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleSelectUser(user.id)}
                                />
                            </td>
                            <td className="border p-2">{user.blocked && user.blocked ? (<Lock size={20}/>) : (<Unlock size={20}/>)}</td>
                            <td className="border p-2">{user.first_name}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{new Date(user.last_login).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
