"use client";

import { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User } from "@/lib/definitions";

export default function DeleteButton({ selectedUsers, setUsers }: { selectedUsers: string[], setUsers: React.Dispatch<React.SetStateAction<User[]>> }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleDeleteUsers = async () => {
        if (selectedUsers.length === 0) {
            setMessage("Please select at least one user to delete.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/users/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userIds: selectedUsers }),
            });

            if (!response.ok) {
                throw new Error("Error deleting users.");
            }

            const data = await response.json();
            setMessage(`Successfully deleted ${data.deletedCount} users.`);

            // Update the state by removing the selected users
            setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user.id)));

        } catch (error) {
            if (error instanceof Error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setMessage("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (message) {
            if (message.startsWith("Error")) {
                toast.error(message);
            } else if (message.startsWith("Successfully deleted")) {
                toast.success(message);
            } else {
                toast.info(message);
            }
        }
    }, [message]);

    return (
        <div className="mb-4 flex flex-col items-center">
            <button
                onClick={handleDeleteUsers}
                disabled={loading}
                className={`p-2 rounded-md ${loading ? "bg-red-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                    } text-white`}
                title="Delete users"
            >
                {loading ? (
                    <div className="animate-spin">
                        <Trash size={20} />
                    </div>
                ) : (
                    <div className="flex flex-row gap-2">
                        <Trash size={20} /> Delete
                    </div>
                )}
            </button>
          
        </div>
    );
}
