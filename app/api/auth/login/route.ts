import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

console.log("JWT_SECRET:", process.env.JWT_SECRET);


export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !body.email || !body.password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const { email, password } = body;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    //Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "7d", // Token valid for 7 days
    });

    //Store the token in an HTTP-only cookie
    const response = NextResponse.json(
      { message: "Login successful", user },
      { status: 200 }
    );
    response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Secure; SameSite=Strict`);

    return response;
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
