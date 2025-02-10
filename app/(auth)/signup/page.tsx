"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/(auth)/form.module.css"; // Import del modulo CSS
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Resetta errori e messaggi
    setError(null)
    setMessage(null)

    // Prepara i dati
    const userData = {
      username,
      email,
      password,
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await res.json()

      if (res.ok) {
        // Registrazione riuscita
        setMessage('Registration successful! Please log in.')
      } else {
        // Gestione degli errori (ad esempio, email o username già esistente)
        setError(data.error || 'An unknown error occurred')
      }
    } catch (err) {
      setError('An error occurred. Please try again later.')
    }
  }


  return (
    <div className={styles.Container}>
      
      <div className={styles.card}>
      <Link href="/">
        <img src="/logo.svg" alt="Logo" className={styles.logo} />
      </Link>
        <h2 className={styles.title}>Register</h2>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
            />
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
                Sign Up
            </button>
        </form>
      </div>
    </div>
  );
}
