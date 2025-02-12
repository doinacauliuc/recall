import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//istanza di prisma per eseguire query sul database
const prisma = new PrismaClient();

//lettura della chiave segreta da .env
const SECRET_KEY: string = process.env.JWT_SECRET!;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}


//funzione eseguita quando quando viene fatta una richiesta POST all'endpoint di login.
//accetta un oggetto Request come parametro

export async function POST(req: Request) {
  try {

    //legge il corpo della richiesta
    const body = await req.json();

    //se manca email o password restituisce valore
    if (!body || !body.email || !body.password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    //scrive il contenuto di body sulle variabili email e password
    const { email, password } = body;

    // cerca un utente nel database con la email specifica
    const user = await prisma.user.findUnique({ where: { email } });

    //se l'utente non esiste restituisce errore
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // confronta il hash delle password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // genera un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "7d", // Token valid for 7 days
    });


    // Set token in HTTP-only cookie
    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/", 
    });
    
    return response;
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
