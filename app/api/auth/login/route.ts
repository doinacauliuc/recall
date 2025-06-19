//user login system

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the Prisma client instance
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Read the secret key from environment variables
const SECRET_KEY: string = process.env.JWT_SECRET!;

// Function to handle POST requests to the login endpoint
export async function POST(req: Request) {
  try {

    
    // Read the request body
    const body = await req.json();

    // Check if email and password are provided
    if (!body || !body.email || !body.password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // Extract email and password from the request body
    const { email, password } = body;

    // Find a user in the database with the provided email
    const user = await prisma.user.findUnique({ where: { email } });

    // If the user does not exist, return an error
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "7d", // Token is valid for 7 days
    });

    // Create a response and set the token in an HTTP-only cookie
    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
    response.cookies.set("token", token, {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevents cross-site request forgery (CSRF) attacks
      maxAge: 7 * 24 * 60 * 60, // Cookie expires in 7 days
      path: "/", // Cookie is accessible across the entire site
    });

    return response;
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
