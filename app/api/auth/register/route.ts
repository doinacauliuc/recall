//user registration

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the Prisma client instance
import bcrypt from "bcrypt";

// Function to handle POST requests for user registration
export async function POST(req: Request) {
  try {
    // Read the request body
    const body = await req.json();

    // Check if all required fields are provided
    if (!body || !body.username || !body.email || !body.password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Extract user details from the request body
    const { username, email, password } = body;

    // Check if a user with the same email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    // If a user already exists, return an error response
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the user's password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user in the database
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    // Return a success response with the created user (excluding password)
    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in register API:", error);

    // Return a generic error response
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
