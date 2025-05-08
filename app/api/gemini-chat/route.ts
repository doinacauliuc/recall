//API used to 

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const history = body.history;
        const note_id = body.note_id;


        const note = await prisma.note.findUnique({
            where: {
                note_id: note_id,
            },
            select: {
                content: true,
            },
        });
        if (!note?.content) {
            return new Response(JSON.stringify({ error: "Note content is empty" }), { status: 404 });
        }

        const key: string = process.env.API_KEY!;
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


        const prompt = `Generate the next message based on this history:\n\n${JSON.stringify(history, null, 2)}\n\n` +
            `Refer to the note content:\n${note.content}\n` +
            `Use a clean format for the response. If the user is stuck, provide a hint. ` +
            `If the user doesn't know or does not remember, help them. ` +
            `If the user is doing well, provide positive feedback. ` +
            `If the user is doing poorly, provide constructive feedback.` +
            `If the user gives an incomplete answer, try asking them to expand on it. `;


        const result = await model.generateContent(prompt);
        const textResponse = await result.response.text();
        console.log("Request body:", body);
        console.log("History:", history);
        console.log("Note content:", note.content);
        console.log("Generated response:", textResponse);


        return new Response(JSON.stringify({ reply: textResponse }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });


    } catch (error) {
        console.error("Error generating message:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
