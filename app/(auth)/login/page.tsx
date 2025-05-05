
"use client"; // Ensures this component runs only on the client side.

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/(auth)/form.module.css";
import Link from "next/link";


export const loginUser = async (email: string, password: string, router: ReturnType<typeof useRouter>) => {
 
  // Send a POST request to the login API
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

  // Parse the response from the server
  const data = await res.json();

  // If login is successful
  if (res.ok) {
    console.log(data);
    console.log("Login successful! Redirecting...");

    // Redirect to the dashboard after 2 seconds
    setTimeout(() => router.push("/dashboard"), 2000);
  } else {
    // If login fails, display the error message
    const errorText = await res.text();
    throw new Error(errorText || "Login failed");
  }
} catch (err) {
  console.log("An error occurred. Please try again.");
}
};

export default function Login() {
  // State variables for email, password, error messages, and success messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
 
  // Next.js router instance for navigation
  const router = useRouter();

  // Handles form submission for login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(null);
    setMessage(null);

    // Check if fields are empty
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      await loginUser(email, password, router);
      setMessage("Login ok");
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  
  };

  return (
    <div className={styles.Container}>
      <div className={styles.card}>
        {/* Logo with a link to the home page */}
        <Link href="/">
          <img src="/logo.svg" alt="Logo" className={styles.logo} />
        </Link>

        {/* Title for the login form */}
        <h2 className={styles.title}>Log In</h2>

        {/* Display error messages if any */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email input field */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          {/* Password input field */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />

          {/* Submit button */}
          <button type="submit" className={styles.button}>
            Log In
          </button>

          {/* Footer with a link to the signup page */}
          <div className={styles.footer}>
            <p>Don't have an account?</p>
            <Link href="/signup" style={{ color: "#223558" }}>
              <p>Sign Up</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
