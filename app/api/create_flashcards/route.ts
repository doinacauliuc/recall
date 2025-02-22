//API used to generate flashcard with Gemini IA

import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma"; // Import the Prisma client instance

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const content = body.content;
        const note_title = body.note_title;
        const user_id = parseInt(body.user_id);
        const set_name = note_title;

        if (!content) {
            return new Response(JSON.stringify({ error: "Content is required" }), { status: 400 });
        }

        const key: string = process.env.API_KEY!;
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Create a series of flashcards based on the following content:\n\n${content}.\n
        Use the format: "Question: [question] | Answer: [answer]". Return multiple flashcards separated by new lines.`;

        const result = await model.generateContent(prompt);
        const textResponse = await result.response.text();

        // Parse the text response into a structured JSON format
        const flashcards = textResponse.split("\n").map(line => {
            const parts = line.split("|");
            if (parts.length === 2) {
                return {
                    question: parts[0].replace("Question:", "").trim(),
                    answer: parts[1].replace("Answer:", "").trim(),
                };
            }
            return null;
        }).filter(card => card !== null);

        console.log("Creating flashcard set: " + note_title);
        console.log(body);
        
        // Create a new flashcard set in the database
        const newSet = await prisma.flashcardSet.create({
            data: { 
                set_name, 
                user_id 
            },
        });

        console.log("Created flashcard set with ID:", newSet.set_id);

        // Insert each flashcard into the database with the set_id
        const createdFlashcards = await prisma.flashcard.createMany({
            data: flashcards.map(fc => ({
                question: fc.question,
                answer: fc.answer,
                set_id: newSet.set_id, // Associate with the newly created set
            })),
        });

        return new Response(JSON.stringify({ 
            flashcardSet: newSet, 
            flashcards: createdFlashcards 
        }), { status: 200 });
        
    } catch (error) {
        console.error("Error generating flashcards:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
