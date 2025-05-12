// API route for managing flashcards

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma"; // Import the Prisma client instance


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url); // Extract query parameters from the request URL
        const userId = searchParams.get("userId"); // Get the user ID from query parameters

        // Check if userId is provided
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Fetch sets that belong to the given user ID
        const sets = await prisma.flashcardSet.findMany({
            where: { user_id: parseInt(userId), deleted: true }, // Ensure user_id is an integer
            select: { set_name: true, set_id: true }, // Select only necessary fields
        });

        const notes = await prisma.note.findMany({
            where: { deleted: true },
            select: { note_id: true, note_title: true },
        });

        return NextResponse.json({sets, notes}, { status: 200 }); // Return the sets as JSON
    } catch (error) {
        console.error("Error fetching sets:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


// Handle PUT request to update knowledge's flashcard
export async function PUT(req: Request) {
    try {
        // Read the request body
        const body = await req.json();
        const option = String(body.option);

        if (option == "change") {
            // Check if email and password are provided
            if (!body || !body.email || !body.newPassword || !body.repeatPassword) {
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
        }else{
            if( option == "restoreSet"){
                const restoreSets = await prisma.flashcardSet.updateMany({
                    where: {
                        set_id: body.set_id
                    },
                    data: { deleted: false }
                });
            }else{
                if( option == "restoreNote"){
                    const restoreSets = await prisma.note.updateMany({
                        where: {
                            note_id: body.note_id
                        },
                        data: { deleted: false }
                    });
                }
            }
        }



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