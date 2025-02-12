

export async function sessionCheck(): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/session-check", {
        method: "GET",
        credentials: "include",
      });
  
      if (!res.ok) {
        return false;
      }
  
      const data = await res.json();
      return data.auth; // Should return true or false
    } catch (error) {
      return false;
    }
  }
  