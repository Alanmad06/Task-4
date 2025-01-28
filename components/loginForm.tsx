"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter()
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); 

    try {
    
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password, 
        }),
      });

      if (!response.ok) {
        setMessage("Error: Something happend trying to Login ");
      }
      
      router.push("/users")
      

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
          Login
        </button>
        {message && (
          <p className={`mt-4 ${message.startsWith("Error") ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        )}
      </form>
    
    </div>
  );
}
