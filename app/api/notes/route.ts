import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma" // Ensure this points to your Prisma client instance

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const course_id = searchParams.get("course_id");
        const note_id = searchParams.get("note_id");

        if (note_id) {
            // ✅ Fetch a specific note by noteID (including content)
            const note = await prisma.note.findUnique({
                where: { note_id: parseInt(note_id) },
                select: { note_title: true, content: true }, // Include content
            });

            if (!note) {
                return NextResponse.json({ error: "Note not found" }, { status: 404 });
            }

            return NextResponse.json(note, { status: 200 });
        }

        if (course_id) {
            // ✅ Fetch all notes for a specific course (title & ID only)
            const notes = await prisma.note.findMany({
                where: { course_id: parseInt(course_id) },
                select: { note_id: true, note_title: true }, // Only return ID and title
            });

            return NextResponse.json(notes, { status: 200 });
        }

        return NextResponse.json({ error: "Either courseID or noteID is required" }, { status: 400 });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const course_id = Number(body.course_id);
        const content = body.content;
        const note_title = body.note_title;

        console.log("Received body:", body);

        // Validate body fields
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }


        if (!note_title || !content || course_id === null || course_id === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Log Prisma query before executing
        console.log("Creating note with:", { note_title, content, course_id });


        const newNote = await prisma.note.create({
            data: {
                note_title: note_title,
                content: content,
                course_id: course_id, 
            },
        });
        


        return NextResponse.json(newNote, { status: 201 });
    } catch (error) {
        console.error("Error creating note:", error);

        // Ensure error messages are returned properly
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const note_id = Number(body.note_id);

        console.log("Received body:", body);

        // Validate body fields
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }


        if (note_id === null || note_id === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        };

        // Log Prisma query before executing
        console.log("Deleting note:", { note_id });


        const deletedNote = await prisma.note.delete({
            where: { note_id: note_id},
        });
        
        return NextResponse.json(deletedNote, { status: 201 });
    } catch (error) {
        console.error("Error deleting note:", error);

        // Ensure error messages are returned properly
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}

