export async function sessionCheck(): Promise<boolean> {
  try {
    // Sending a GET request to check the session
    const res = await fetch("/api/auth/session-check", {
      method: "GET",           // HTTP method is GET
      credentials: "include",  // Include cookies with the request
    });

    // If the response is not OK, return false
    if (!res.ok) {
      return false;
    }

    // Parse the response as JSON
    const data = await res.json();

    // Return the value of 'auth' from the response (true or false)
    return data.auth; 
  } catch (error) {
    // If an error occurs, return false
    return false;
  }
}
