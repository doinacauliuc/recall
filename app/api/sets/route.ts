//API route for managing flashcard sets

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the Prisma client instance

// Handle GET request to fetch sets for a specific user
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
            where: { user_id: parseInt(userId), deleted: false }, // Ensure user_id is an integer
            select: { set_name: true, set_id:true }, // Select only necessary fields
        });

        return NextResponse.json(sets, { status: 200 }); // Return the sets as JSON
    } catch (error) {
        console.error("Error fetching sets:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


// Handle POST request to create a new set
export async function POST(req: Request) {
    try {
        const { set_name, user_id } = await req.json(); // Parse request body
       
        // Validate required fields
        if (!set_name || !user_id) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Create a new set in the database
        const newSet = await prisma.flashcardSet.create({
            data: { set_name, user_id },
        });

        return NextResponse.json(newSet, { status: 201 }); // Return the newly created set
    } catch (error) {
        console.error("Error adding set:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


// Handle DELETE request to remove a set
export async function DELETE(req: Request) {
    try {
        const body = await req.json(); // Parse request body
        const set_id = Number(body.set_id); // Convert set_id to a number

        console.log("Received body:", body);

        // Validate the request body
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        if (set_id === null || set_id === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Log the set ID before deleting
        console.log("Deleting course:", { set_id });

        // Delete the set from the database
        const deletedSet = await prisma.flashcardSet.updateMany({
            where: { set_id: set_id },
            data: { deleted: true }
        });

        return NextResponse.json(deletedSet, { status: 201 }); // Return deleted set data
    } catch (error) {
        console.error("Error deleting set:", error);

        // Return an error response with appropriate message
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}

