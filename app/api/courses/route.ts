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

