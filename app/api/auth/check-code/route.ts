import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {

        console.log("Received request in check-code route");
        const body = await req.json();
        const { email, recoveryCode, newPassword } = body

        console.log("Received data:", { email, recoveryCode, newPassword });

        if (!email || !recoveryCode || !newPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }


        const recovery = await prisma.passwordReset.findFirst({
            where: { email, code: recoveryCode.toString() },
        });

        console.log("Recovery entry found:", recovery);

        if (!recovery) {
            return NextResponse.json({ error: "Invalid recovery code" }, { status: 404 });
        }

        if (new Date() > new Date(recovery.expiresAt)) {
            return NextResponse.json({ error: "Recovery code has expired" }, { status: 410 });
        }

        // Hash the user's password for security
            const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update user's password
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }, // Ensure you hash the password in a real application
        });

        // Delete the recovery entry
        await prisma.passwordReset.delete({ where: { id: recovery.id } });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in check-code route:", error);
        return NextResponse.json({ error: "An error occurred. Please try again later." }, { status: 500 });
    }
}
