"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          email,
          password,
        }),
      });

      if (!response.ok) {
        setMessage("Error: something happend while Register");
      }


      setMessage(`User created successfully`);
      router.push('/login')
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  useEffect(() => {

    if (message && message.startsWith("Error")) {
      toast.error(message);
    }

  }, [message]);
  return (
    <div className="flex items-center justify-center max-h-screen bg-gray-100 m-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <label className="block mb-4 text-black">
          Nombre:
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label className="block mb-4 text-black">
          Email:
          <input
            type="email"
            className="mt-1 p-2 w-full border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block mb-4 text-black">
          Contraseña:
          <input
            type="password"
            className="mt-1 p-2 w-full border rounded"
            value={password}
            min={1}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Crear Usuario
        </button>
        {message && (
          <p className={`mt-4 ${message.startsWith("Error") ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        )}
        <div className="mt-4 text-center">
          <p className="text-black">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Iniciar sesión
            </a>
          </p>
        </div>
      </form>


    </div>
  );
}
