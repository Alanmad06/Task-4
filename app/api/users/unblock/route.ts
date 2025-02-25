import { getConnection } from "@/auth";

import { OkPacket, FieldPacket, Connection } from "mysql2/promise";
import { NextResponse } from "next/server";

let db : Connection | undefined;

export async function POST(request: Request) {
  try {
    db = await  getConnection()
    const { userIds } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "No se proporcionaron IDs de usuarios." }, { status: 400 });
    }

    const query = `
      UPDATE users 
      SET blocked = 0
      WHERE id IN (?)
    `;
    const [result]:  [OkPacket, FieldPacket[]] = await db.query(query, [userIds]);

    return NextResponse.json({ blockedCount: result.affectedRows });
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
    }
  }
}
