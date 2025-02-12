
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/(auth)/form.module.css";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    //richiesta post al server per verificare le credenziali
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      //risposta del server
      const data = await res.json();

      
      if (res.ok) {
        setMessage("Login successful! Redirecting...");
        console.log(data);
        console.log("Login successful! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 2000); // Redirect after 2s
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.card}>
        <Link href="/">
          <img src="/logo.svg" alt="Logo" className={styles.logo} />
        </Link>
        <h2 className={styles.title}>Log In</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Log In
          </button>
          <div className={styles.footer}>
            <p>Don't have an account?</p>
            <Link href= "/signup" style={{ color: "#223558" }}>
              <p>Sign Up</p>
            </Link>
          </div>
          
        </form>
      </div>
    </div>
  );
}
