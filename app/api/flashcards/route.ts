// API route for managing flashcards

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the Prisma client instance


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url); // Extract query parameters from the request URL
        const setID = searchParams.get("set_id"); // Get the user ID from query parameters

        // Check if userId is provided
        if (!setID) {
            return NextResponse.json({ error: "Set ID is required" }, { status: 400 });
        }

        // Fetch courses that belong to the given user ID
        const flashcards = await prisma.flashcard.findMany({
            where: { set_id: parseInt(setID) }, // Ensure user_id is an integer
            select: { flashcard_id: true, question: true, answer: true }, // Select only necessary fields
        });

        return NextResponse.json(flashcards, { status: 200 }); // Return the courses as JSON
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle POST request to create a new flashcard
export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse request body
        const set_id = Number(body.set_id);
        const question = body.question;
        const answer = body.answer;

        console.log("Received body:", body);

        // Validate required fields
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        if (!question || !answer || set_id === null || set_id === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Create a new note in the database
        const newFlashcard = await prisma.flashcard.create({
            data: {
                question,
                answer,
                set_id,
            },
        });

        return NextResponse.json(newFlashcard, { status: 201 }); // Return the newly created note
    } catch (error) {
        console.error("Error creating flashcard:", error);

        // Return appropriate error response
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}