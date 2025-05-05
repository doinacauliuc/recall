"use client"; // Ensures this component runs only on the client side.

import { useState } from "react";
import styles from "@/app/(auth)/form.module.css"; // Import custom CSS for styling
import Link from "next/link"; // Import Link component for navigation between pages
import { loginUser } from "../login/page";
import { useRouter } from "next/navigation";

export default function Register() {
  // State variables to manage form data (username, email, password)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State variables to handle error and success messages
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Reset any previous error or message
    setError(null);
    setMessage(null);

    // Prepare the user data to send to the API
    const userData = {
      username,
      email,
      password,
    };

    // Send POST request to the registration API endpoint
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Parse the response
      const data = await res.json();

      if (res.ok) {
        // If registration is successful, set success message and redirect to dashboard
        setMessage('Registration successful! Log in...');
        loginUser(email,password, router);
      } else {
        // If an error occurred (e.g., username or email already exists), set error message
        setError(data.error || 'An unknown error occurred');
      }
    } catch (err) {
      // Catch and handle any errors from the fetch request
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.card}>
        {/* Logo with a link to navigate back to the homepage */}
        <Link href="/">
          <img src="/logo.svg" alt="Logo" className={styles.logo} />
        </Link>
        {/* Title of the form */}
        <h2 className={styles.title}>Register</h2>

        {/* Display error message if present */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Display success message if present */}
        {message && <p className={styles.message}>{message}</p>}

        {/* Form for registering a new user */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={styles.formGroup}>
            {/* Input for username */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
            {/* Input for email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            {/* Input for password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>
          {/* Submit button */}
          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
