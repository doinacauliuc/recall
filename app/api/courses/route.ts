import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma" // Ensure this points to your Prisma client instance

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Fetch courses related to the user
        const courses = await prisma.course.findMany({
            where: { user_id: parseInt(userId) }, // ✅ Match correct column name
            select: { course_id: true, course_name: true }, // ✅ Match correct fields
        });

        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { course_name, user_id } = await req.json();
        if (!course_name || !user_id) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newCourse = await prisma.course.create({
            data: { course_name, user_id },
        });

        return NextResponse.json(newCourse, { status: 201 });
    } catch (error) {
        console.error("Error adding course:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const course_id = Number(body.course_id);

        console.log("Received body:", body);

        // Validate body fields
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }


        if (course_id === null || course_id === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        };

        // Log Prisma query before executing
        console.log("Deleting course:", { course_id });


        const deletedNote = await prisma.course.delete({
            where: { course_id: course_id},
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

