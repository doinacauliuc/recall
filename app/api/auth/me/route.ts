import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!;


export async function GET(req: NextRequest) {
    try {
        
        //Leggere il token dai cookies
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ user: null }, { status: 401 });
        }
    
        // Decodifica il token
        const decoded = jwt.verify(token, SECRET_KEY) as { id: number; email: string };
    
        // Riprende l'user dal database
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, username: true }, 
        });
    
        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 });
        }
    
        return NextResponse.json({ user });
        } catch (error) {
        return NextResponse.json({ user: null }, { status: 401 });
        }
  }
  

