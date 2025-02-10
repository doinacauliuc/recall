
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// ✅ Correct way to define a POST route in Next.js App Router
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !body.username || !body.email || !body.password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { username, email, password } = body;

    // Check if user already exists (either username or email)
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in database
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in register API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
