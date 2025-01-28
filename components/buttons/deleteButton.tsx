"use client";

import { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User } from "@/lib/definitions";

export default function DeleteButton({ selectedUsers, setUsers }: { selectedUsers: string[], setUsers: React.Dispatch<React.SetStateAction<User[]>> }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleDeleteUsers = async () => {
        if (selectedUsers.length === 0) {
            setMessage("Selecciona al menos un usuario para eliminar.");
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
                throw new Error("Error al eliminar los usuarios.");
            }

            const data = await response.json();
            setMessage(`Se eliminaron ${data.deletedCount} usuarios correctamente.`);

            // Actualiza el estado de los usuarios eliminando los seleccionados
            setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user.id)));

        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (message) {
            if (message.startsWith("Error")) {
                toast.error(message);
            } else if (message.startsWith("Se eliminaron")) {
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
                title="Eliminar usuarios"
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
            <ToastContainer />
        </div>
    );
}
