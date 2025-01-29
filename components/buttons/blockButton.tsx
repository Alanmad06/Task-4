"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User } from "@/lib/definitions";

export default function BlockButton({ selectedUsers, setUsers }: { selectedUsers: string[], setUsers: React.Dispatch<React.SetStateAction<User[]>> }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleBlockUsers = async () => {
        console.log(selectedUsers);
        if (selectedUsers.length === 0) {
            setMessage("Please select at least one user to block.");
            return;
        }

        setLoading(true);
        setMessage("");  // Clear the message

        try {
            const response = await fetch("/api/users/block", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userIds: selectedUsers }),
            });

            if (!response.ok) {
                throw new Error("Error blocking users.");
            }

            const data = await response.json();
            setMessage(`Successfully blocked ${data.blockedCount} users.`);

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    selectedUsers.includes(user.id) ? { ...user, blocked: true } : user
                )
            );

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
            } else if (message.startsWith("Successfully blocked")) {
                toast.success(message);
            } else {
                toast.info(message);
            }
        }
    }, [message]);

    return (
        <div className="mb-4 flex flex-col items-center">
            <button
                onClick={handleBlockUsers}
                disabled={loading}
                className={`p-2 rounded-md ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                title="Block users"
            >
                {loading ? (
                    <div className="animate-spin">
                        <Lock size={20} />
                    </div>
                ) : (
                    <div className="flex flex-row gap-2">
                        <Lock size={20} /> Block
                    </div>
                )}
            </button>
        </div>
    );
}
