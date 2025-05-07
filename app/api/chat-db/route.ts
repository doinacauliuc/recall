// API route for managing chats in database

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the Prisma client instance
import { parse } from "path";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json(); // Parse request body
        const user_id = Number(body.user_id);
        const chat_title = body.chat_title;
        const messages = body.messages;
        const last_opened = new Date();
        console.log("Received body:", body);

        // Validate required fields
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }
        if (!chat_title || !messages || user_id === null || user_id === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        // Create a new chat in the database
        const newChat = await prisma.chat.create({
            data: {
                user_id,
                chat_title,
                last_opened,
                messages,
            },
        });
        return NextResponse.json(newChat, { status: 201 }); // Return the newly created note
    }
    catch (error) {
        console.error("Error creating chat:", error);

        // Return appropriate error response
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url); // Extract query parameters from the request URL
        const user_id = Number(searchParams.get("user_id")); // Get the user ID from query parameters
        const chat_id = Number(searchParams.get("chat_id")); // Get the chat ID from query parameters

        if (user_id) {
            // Fetch all chats for the user from the database
            const chats = await prisma.chat.findMany({
                where: {
                    user_id: user_id, // Filter chats by user ID
                },
                select: {
                    chat_id: true,
                    chat_title: true,
                },
                orderBy: {
                    last_opened: "desc", // Order by last opened date in descending order
                },
            });
            console.log("Fetched chats:", chats); // Log the fetched chats for debugging

            return NextResponse.json(chats, { status: 200 }); // Return the list of chats
        }
        else if (chat_id) {
            const messages = await prisma.chat.findUnique({
                where: {
                    chat_id: chat_id, // Filter chat by chat ID
                },
                select: {
                    messages: true,
                },
            });
            if (!messages) {
                return NextResponse.json({ error: "Chat not found" }, { status: 404 });
            }
            console.log("Fetched messages:", messages); // Log the fetched messages for debugging
            return NextResponse.json(messages, { status: 200 }); // Return the messages for the chat    
        }
        else {
            return NextResponse.json({ error: "Either userID or chatID is required" }, { status: 400 });
        }

    } catch (error) {
        console.error("Error fetching chats:", error);

        // Return appropriate error response
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json(); // Parse request body
        const chat_id = Number(body.chat_id);
        const messages = body.messages;
        const last_opened = new Date();

        // Validate required fields
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }
        if (!messages || chat_id === null || chat_id === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        // Update the chat in the database
        const updatedChat = await prisma.chat.update({
            where: {
                chat_id,
            },
            data: {
                messages,
                last_opened,
            },
        });
        return NextResponse.json(updatedChat, { status: 200 }); // Return the updated chat
    } catch (error) {
        console.error("Error updating chat:", error);

        // Return appropriate error response
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}