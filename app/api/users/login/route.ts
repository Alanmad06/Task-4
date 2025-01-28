import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

const db = await createConnection();

export async function GET() {
  try {
    const query = 'SELECT email,password FROM users ';
    const [rows] = await db.query(query);
    return NextResponse.json(rows);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message });
  }
}