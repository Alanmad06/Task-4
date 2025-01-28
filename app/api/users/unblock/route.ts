import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

const db = await createConnection();

export async function POST(request: Request) {
  try {
    const { userIds } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "No se proporcionaron IDs de usuarios." }, { status: 400 });
    }

    const query = `
      UPDATE users 
      SET blocked = 0
      WHERE id IN (?)
    `;
    const [result]: any = await db.query(query, [userIds]);

    return NextResponse.json({ blockedCount: result.affectedRows });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
