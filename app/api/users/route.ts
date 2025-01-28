import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getConnection } from "@/auth";
import { OkPacket, FieldPacket } from "mysql2";

const db = await getConnection();

export async function GET() {
  try {
    const query = "SELECT * FROM users";
    const [rows] :  [OkPacket, FieldPacket[]] = await db.query(query);
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const { first_name, email, password } = await request.json();

    if (!first_name || !email || !password) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (first_name, email, password, last_login) 
      VALUES (?, ?, ?, NOW())
    `;
    const [result] : [OkPacket, FieldPacket[]] = await db.query(query, [first_name, email, hashedPassword]);

    return NextResponse.json({ id: result.affectedRows });
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
    }
  }
}
