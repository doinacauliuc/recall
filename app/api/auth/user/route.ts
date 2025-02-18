//checking the logged-in user's details based on their session

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma"; // Import the Prisma client instance

// Retrieve the secret key from environment variables
const SECRET_KEY = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
    try {
        // Read the token from cookies
        const token = req.cookies.get("token")?.value;

        // If the token is missing, return an unauthorized response
        if (!token) {
            return NextResponse.json({ user: null }, { status: 401 });
        }
    
        // Decode and verify the token
        const decoded = jwt.verify(token, SECRET_KEY) as { id: number; email: string };
    
        // Fetch the user from the database using the decoded ID
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, username: true }, // Select only required fields
        });

        // If user is not found, return an unauthorized response
        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 });
        }
    
        // Return the user details
        return NextResponse.json({ user });

    } catch (error) {
        // Handle any errors (e.g., invalid token, database errors)
        return NextResponse.json({ user: null }, { status: 401 });
    }
}

