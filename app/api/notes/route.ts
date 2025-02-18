//API route for managing notes

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the Prisma client instance

// Handle GET request to fetch notes
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url); // Extract query parameters
        const course_id = searchParams.get("course_id");
        const note_id = searchParams.get("note_id");

        if (note_id) {
            // Fetch a specific note by note_id (including content)
            const note = await prisma.note.findUnique({
                where: { note_id: parseInt(note_id) },
                select: { note_title: true, content: true }, // Include note title and content
            });

            if (!note) {
                return NextResponse.json({ error: "Note not found" }, { status: 404 });
            }

            return NextResponse.json(note, { status: 200 }); // Return the specific note
        }

        if (course_id) {
            // Fetch all notes for a specific course (only returning note_id & title)
            const notes = await prisma.note.findMany({
                where: { course_id: parseInt(course_id) },
                select: { note_id: true, note_title: true },
            });

            return NextResponse.json(notes, { status: 200 }); // Return all notes for the course
        }

        return NextResponse.json({ error: "Either courseID or noteID is required" }, { status: 400 });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle POST request to create a new note
export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse request body
        const course_id = Number(body.course_id);
        const content = body.content;
        const note_title = body.note_title;

        console.log("Received body:", body);

        // Validate required fields
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        if (!note_title || !content || course_id === null || course_id === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Log data before creating a note
        console.log("Creating note with:", { note_title, content, course_id });

        // Create a new note in the database
        const newNote = await prisma.note.create({
            data: {
                note_title,
                content,
                course_id,
            },
        });

        return NextResponse.json(newNote, { status: 201 }); // Return the newly created note
    } catch (error) {
        console.error("Error creating note:", error);

        // Return appropriate error response
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Handle DELETE request to remove a note
export async function DELETE(req: Request) {
    try {
        const body = await req.json(); // Parse request body
        const note_id = Number(body.note_id);

        console.log("Received body:", body);

        // Validate request body
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        if (note_id === null || note_id === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Log note_id before deleting
        console.log("Deleting note:", { note_id });

        // Delete the note from the database
        const deletedNote = await prisma.note.delete({
            where: { note_id },
        });

        return NextResponse.json(deletedNote, { status: 201 }); // Return deleted note data
    } catch (error) {
        console.error("Error deleting note:", error)
    }
}