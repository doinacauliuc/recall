// API route for managing flashcards

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma"; // Import the Prisma client instance


// Handle PUT request to update knowledge's flashcard
export async function PUT(req: Request) {
    try {
        // Read the request body
        const body = await req.json();

        // Check if email and password are provided
        if (!body || !body.email || !body.newPassword || !body.repeatPassword ) {
            return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
        }

        // Extract email and password from the request body
        const { email, newPassword, repeatPassword } = body;

        // Find a user in the database with the provided email
        const user = await prisma.user.findUnique({ where: { email } });

        // If the user does not exist, return an error
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = newPassword === repeatPassword;
        if (!passwordMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const changePw = await prisma.user.updateMany({
            where: {
                email: email
            },
            data: {
                password: hashedPassword
            }
        });

        return NextResponse.json({ status: 201 }); // Return success 

    } catch (error) {
        console.error("Error changing password:", error);

        // Return appropriate error response
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}