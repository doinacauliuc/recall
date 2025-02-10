import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  // Controlla se l'email è già usata
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "Account linked to this email addres already exits" }, { status: 400 });
  }

  // Crittografa la password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crea il nuovo utente
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return NextResponse.json(user);
}
