"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "/Users/cauliucdoina/React Projects/recall/app/(auth)/form.module.css"; // Import del modulo CSS

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register.ts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Errore nella registrazione");
      return;
    }

    router.push("/dashboard"); // Redirect to a dashboard or login page after success
  };

  return (
    <div className={styles.Container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="firstName"
                placeholder="First Name"
                value={form.name}
                onChange={(e) => setFirstName(e.target.value)}
                className={styles.input}
            />
            <input
                type="lastName"
                placeholder="Last Name"
                value={form.name}
                onChange={(e) => setLastName(e.target.value)}
                className={styles.input}
            />
            <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
            />
            <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
            />
            <button type="submit" className={styles.button}>
                Sign Up
            </button>
          
        </form>
      </div>
    </div>
  );
}
