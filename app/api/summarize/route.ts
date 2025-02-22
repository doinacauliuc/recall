import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma"; // Import the Prisma client instance

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const content = body.content;
        const note_title = body.note_title;
        const course_id = body.course_id;
        const summary_title = note_title + " - summary";

        if (!content) {
            return new Response(JSON.stringify({ error: "Content is required" }), { status: 400 });
        }

        const key : string = process.env.API_KEY!;
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Summarize the following content:\n\n${content}`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text();
        console.log(summary);

        // Log data before creating a note
        console.log("Creating summary with:", { summary_title, content, course_id });

        // Create a new note in the database
        const newNote = await prisma.note.create({
            data: {
                note_title: summary_title,
                content: summary,
                course_id,
            },
        });

        return new Response(JSON.stringify({ summary }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
