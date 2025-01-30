import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getConnection, getUser } from "@/auth";
import { OkPacket, FieldPacket, Connection } from "mysql2/promise";

let db : Connection | undefined;

export async function GET() {
  try {
    db  = await getConnection()
    const query = "SELECT id,first_name,blocked,email,last_login FROM users";
    const [rows] :  [OkPacket, FieldPacket[]] = await db!.query(query);
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
    db  = await getConnection()
    const { first_name, email, password } = await request.json();

    if (!first_name || !email || !password) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = !!await getUser(email);
    console.log('USER:',user)
    
    if(user){
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO users (id,first_name, email, password, last_login) 
      VALUES (UUID(),?, ?, ?, NOW())
    `;
    const [result] : [OkPacket, FieldPacket[]] = await db!.query(query, [first_name, email, hashedPassword]);

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
