import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = NextResponse.json({ message: "Logged out successfully" });
  // Remove the token from cookies
  response.cookies.delete("token");
  return response;
}
