import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Must be an app password (not your login password)
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    const existingRecovery = await prisma.passwordReset.findFirst({ where: { email } });

    if (existingRecovery) {
      await prisma.passwordReset.update({
        where: { id: existingRecovery.id },
        data: { code: recoveryCode, expiresAt: expirationTime },
      });
    } else {
      await prisma.passwordReset.create({
        data: {
          email,
          code: recoveryCode,
          expiresAt: expirationTime,
        },
      });
    }

    // Send recovery email
    await transporter.sendMail({
      from: `"Recall Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Password Recovery Code",
      html: `
        <div style="font-family: sans-serif; line-height: 1.4;">
          <p>Your password recovery code is:</p>
          <h2>${recoveryCode}</h2>
          <p>This code will expire in <strong>15 minutes</strong>.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Recovery email sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error in send-recovery-email API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
