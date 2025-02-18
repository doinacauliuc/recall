// API route for managing courses

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the Prisma client instance

// Handle GET request to fetch courses for a specific user
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url); // Extract query parameters from the request URL
        const userId = searchParams.get("userId"); // Get the user ID from query parameters

        // Check if userId is provided
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Fetch courses that belong to the given user ID
        const courses = await prisma.course.findMany({
            where: { user_id: parseInt(userId) }, // Ensure user_id is an integer
            select: { course_id: true, course_name: true }, // Select only necessary fields
        });

        return NextResponse.json(courses, { status: 200 }); // Return the courses as JSON
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle POST request to create a new course
export async function POST(req: Request) {
    try {
        const { course_name, user_id } = await req.json(); // Parse request body
       
        // Validate required fields
        if (!course_name || !user_id) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Create a new course in the database
        const newCourse = await prisma.course.create({
            data: { course_name, user_id },
        });

        return NextResponse.json(newCourse, { status: 201 }); // Return the newly created course
    } catch (error) {
        console.error("Error adding course:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle DELETE request to remove a course
export async function DELETE(req: Request) {
    try {
        const body = await req.json(); // Parse request body
        const course_id = Number(body.course_id); // Convert course_id to a number

        console.log("Received body:", body);

        // Validate the request body
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        if (course_id === null || course_id === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Log the course ID before deleting
        console.log("Deleting course:", { course_id });

        // Delete the course from the database
        const deletedNote = await prisma.course.delete({
            where: { course_id: course_id },
        });

        return NextResponse.json(deletedNote, { status: 201 }); // Return deleted course data
    } catch (error) {
        console.error("Error deleting note:", error);

        // Return an error response with appropriate message
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
