//checking if a user is logged in and retrieving their session details

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Get the secret key from environment variables
const SECRET_KEY = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
    try {
        // Read the token from cookies
        const token = req.cookies.get("token")?.value;

        // If no token is found, return an unauthorized response
        if (!token) {
            console.log("check failed");
            return NextResponse.json({ auth: false, message: "Token missing" }, { status: 401 });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, SECRET_KEY) as { id: number; email: string };
        console.log("check ok");

        // Return the session status with user details
        return NextResponse.json({
            auth: true,
            user: { id: decoded.id, email: decoded.email },
        });

    } catch (error) {
        // Handle token verification errors
        return NextResponse.json({ auth: false, message: "Invalid or expired token" }, { status: 401 });
    }
}

