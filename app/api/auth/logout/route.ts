//logging out the user by removing their authentication token

import { NextRequest, NextResponse } from "next/server";

// Function to handle GET requests for logging out
export async function GET(req: NextRequest) {
  // Create a response with a success message
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Remove the token from cookies to log out the user
  response.cookies.delete("token");

  // Return the response
  return response;
}

