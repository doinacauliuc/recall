"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth"; // Import the custom hook
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth(); // Use the hook to get user and loading state
  const [localUser, setLocalUser] = useState<{ id: number; email: string; username: string } | null>(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!loading && user === null) {
      router.push("/login"); // Redirect to login if user is not authenticated
    } else if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // Store user in localStorage
      setLocalUser(user);
    }
  }, [user, loading, router]);

  if (loading && !localUser) {
    return <div>Loading...</div>; // Show loading indicator while fetching user data
  }

  if (!loading && user === null && !localUser) {
    return <div>Redirecting...</div>; // Show redirecting message if user is not authenticated
  }

  const displayUser = user || localUser;

  return (
    <div>
      <Navbar />
      <h1>Dashboard</h1>
      <p>Welcome, {displayUser?.username}</p>
    </div>
  );
}
