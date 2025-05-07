"use client"; 

import { useState, useEffect, createContext, useContext } from "react";
import useAuth, { type User } from "./userData"; // Import custom hook for authentication

// Define the context type
interface UserContextType {
  user: User | null;
}

// Create the context for user data (initially undefined)
const UserContext = createContext<UserContextType | undefined>(undefined);

// Component that provides user data to children components
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth(); // Retrieve user data from authentication system
  const [localUser, setLocalUser] = useState<User | null>(null); // Local state to store user data

  // Fetch user data from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser)); // Parse and set user data if it exists in localStorage
    }
  }, []); // Empty dependency array, runs only once on mount

  // If user data changes (user logs in), update localStorage and state
  useEffect(() => {
    if (user !== null) {
      localStorage.setItem("user", JSON.stringify(user)); // Save user data to localStorage
      setLocalUser(user); // Update local state with user data
    }
    else{
      localStorage.removeItem("user"); // Remove user data from localStorage if user is null
      setLocalUser(null); // Update local state to null
    }
  }, [user]); // This effect runs when the 'user' data changes

  return (
    // Provide user data to children components via context
    <UserContext.Provider value={{ user: localUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the user data from context
export const useUser = () => {
  const context = useContext(UserContext); // Access the context
  if (!context) {
    throw new Error("useUser must be used within a UserProvider"); // Error if not used within the provider
  }
  return context; // Return the user context value
};