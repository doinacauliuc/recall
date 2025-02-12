"use client"; // Ensure it's a client-side hook

import { useState, useEffect, createContext, useContext } from "react";
import useAuth from "./useAuth"; // Import the custom hook
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  username: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, loading } = useAuth(); // Fetch user from your authentication system
  const [localUser, setLocalUser] = useState<User | null>(null);

  // Load user from localStorage on mount (for persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  // Sync user state and handle redirection
  useEffect(() => {
    if (!loading && user === null) {
      router.push("/login"); // Redirect if not authenticated
    } else if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setLocalUser(user);
    }
  }, [user, loading, router]);

  return (
    <UserContext.Provider value={{ user: user || localUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the user
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
