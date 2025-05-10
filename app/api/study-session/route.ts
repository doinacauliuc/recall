import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startOfWeek, endOfWeek, format } from 'date-fns';

export async function POST(req: NextRequest) {
    const { userId, duration } = await req.json(); // Parse request body
    console.log("Received data:", { userId, duration });
    try {
        // Validate required fields
        if (!userId || !duration) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Create a new study session in the database
        const newSession = await prisma.studySession.create({
            data: {
                user_id: userId,
                duration: duration,
                date: new Date(), // Set the current date
            },
        });

        return NextResponse.json(newSession, { status: 201 }); // Return the newly created session
    }
    catch (error) {
        console.error("Error creating study session:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });     // Sunday

    const sessions = await prisma.studySession.groupBy({
      by: ['date'],
      where: {
        user_id: Number(userId),
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        duration: true,
      },
    });

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const studyMap = Object.fromEntries(weekDays.map(day => [day, 0]));

    sessions.forEach(session => {
      const day = format(new Date(session.date), 'EEEE');
      if (session._sum.duration !== null && session._sum.duration !== undefined) {
        studyMap[day] += session._sum.duration / 60; // convert minutes to hours
      }
    });

    const rawData = weekDays.map(day => ({
      day,
      hours: Number(studyMap[day].toFixed(2)), // round to 2 decimal places
    }));

    return NextResponse.json(rawData);
  } catch (error) {
    console.error('Error fetching study data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
