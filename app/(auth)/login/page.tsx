"use client"; // Ensures this component runs only on the client side.

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/(auth)/form.module.css";
import Link from "next/link";
import useAuth from "@/app/hooks/userData"; // Importing a function to refetch user data


export default function Login() {
  // State variables for email, password, error messages, and success messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { refetchUser } = useAuth(); // Function to refetch user data


  // Next.js router instance for navigation
  const router = useRouter();

  // Handles form submission for login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if fields are empty
    if (!email || !password) {
      alert("All fields must be filled out");
      return;
    }

    // Send a POST request to the login API
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // response from the server
     await res.json();

      // If login is successful
      if (res.ok) {
        refetchUser(); // Refetch user data to update the context
        // Redirect to the dashboard after 2 seconds
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        // If login fails, display the error message
        alert("Login failed");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
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
          <Link href="/forgot-password" style={{ color: "#223558" }}>
              <p>Forgot Password?</p>
            </Link>
        </form>
      </div>
    </div>
  );
}