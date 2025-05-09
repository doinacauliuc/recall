
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the Prisma client instance

function getDateRange(dateStr: string) {
  const date = new Date(dateStr);
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}
export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url); // Extract query parameters from the request URL
    const userId = searchParams.get("userId"); // Get the user ID from query parameters
    const date = searchParams.get("date"); // Get the date from query parameters
    const { start: startOfDay, end: endOfDay } = getDateRange(date || new Date().toISOString()); // Get the start and end of the day
    // Check if userId is provided
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    try {
        // Fetch tasks that belong to the given user ID and date
        console.log("Fetching tasks for userId:", userId, "on date:", date);
        const tasks = await prisma.task.findMany({
            where: {
                user_id: parseInt(userId), // Ensure user_id is an integer
                date: {
                    gte: new Date(startOfDay), // 2025-05-09T00:00:00.000Z
                    lt: new Date(endOfDay),    // 2025-05-10T00:00:00.000Z
                } // Ensure date is a valid date
            },
            select: {
                task_id: true,
                task_title: true,
                completed: true,
                date: true,
                user_id: true,
            },
        });
        return NextResponse.json(tasks, { status: 200 }); // Return the tasks as JSON
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle POST request to create a new task
export async function POST(req: Request) {
    const body = await req.json(); // Parse request body
    const { task_title, completed, date, user_id } = body; // Destructure the request body   
    // Validate required fields
    if (!task_title || !user_id || !date) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    try {
        // Create a new task in the database
        const newTask = await prisma.task.create({
            data: {
                task_title: task_title,
                completed: completed,
                date: new Date(date), // Ensure date is a valid date
                user_id: parseInt(user_id), // Ensure user_id is an integer
            },
        });
        console.log("New task created:", newTask); // Log the newly created task
        return NextResponse.json(newTask, { status: 201 }); // Return the newly created task
    }
    catch (error) {
        console.error("Error adding task:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}

// Handle PUT request to update a task
export async function PUT(req: Request) {
    const body = await req.json(); // Parse request body
    const { task_id, completed } = body; // Destructure the request body

    // Validate required fields
    if (!task_id || completed === undefined) {  
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    try {
        // Update the task in the database
        const updatedTask = await prisma.task.update({
            where: {
                task_id: parseInt(task_id), // Ensure task_id is an integer
            },
            data: {
                completed: completed, // Update the completion status
            },
        });
        console.log("Task updated:", updatedTask); // Log the updated task
        return NextResponse.json(updatedTask, { status: 200 }); // Return the updated task
    }
    catch (error) {     
        console.error("Error updating task:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}

// Handle DELETE request to delete a task
export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url); // Extract query parameters from the request URL
    const taskId = searchParams.get("taskId"); // Get the task ID from query parameters

    // Validate required fields
    if (!taskId) {
        return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }
    try {
        // Delete the task from the database
        const deletedTask = await prisma.task.delete({
            where: {
                task_id: parseInt(taskId), // Ensure task_id is an integer
            },
        });
        console.log("Task deleted:", deletedTask); // Log the deleted task
        return NextResponse.json(deletedTask, { status: 200 }); // Return the deleted task
    }
    catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}