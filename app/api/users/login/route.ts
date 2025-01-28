import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await signIn("credentials", body);

   
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return new Response(
            JSON.stringify({ error: "Invalid credentials." }),
            {
              status: 401,
              headers: { "Content-Type": "application/json" },
            }
          );
        default:
          return new Response(
            JSON.stringify({ error: "Something went wrong." }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
      }
    }
    
    
    throw error
  }
}
