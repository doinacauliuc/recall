"use client";

import { useEffect, useState } from "react"; // Import React hooks for state management and side effects
import styles from "@/components/styles/settings.module.css"; // Import CSS styles for the component
import Link from "next/link";
import { Lock, AtSign, KeyRound } from 'lucide-react';


interface ChangePasswordPageProps {
    onBack: () => void;
}

// The component responsible for displaying the list of notes for a selected course
export default function ChangePasswordPage({ onBack }: ChangePasswordPageProps) {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handles form submission for login
    const handleChangePW = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Check if fields are empty
        if (!email || !newPassword || !repeatPassword) {
            alert("All fields must be filled out");
            return;
        }
    }

    const changePW = async () => {
        // Set loading state to true and clear previous errors
        setLoading(true);


        try {
            // Send a PUT request to change the knowledge to the database
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ option: "change", email, newPassword, repeatPassword }),
            });

            console.log(res);
            // If the request fails, throw an error
            if (!res.ok) {
                throw new Error("Failed to change password.");
            }


            console.log("Password changed") // Log successful decrement knowledge
            onBack(); // Ritorna alla pagina iniziale
        } catch (err) {
            console.error("Error changing password:", err); // Log error to the console
            setError("Failed to change password."); // Display an error message
        } finally {
            setLoading(false); // Set loading to false after the operation is complete
        }
    };


    return (

        <div className={styles.card}>
            <div className={styles.buttonContainer3}>
                    <button onClick={onBack} className={styles.backButton}>Back to Settings</button>
                </div>
            <div className={styles.Container}>
                {/* Logo with a link to the home page */}
                
                <div className={styles.imageContainer}>
                    <AtSign size={50} />
                    <KeyRound size={50} />
                    <KeyRound size={50} />
                </div>


                {/* Title for the login form */}

                {/* Login form */}
                <form onSubmit={handleChangePW} className="space-y-4">
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
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Repeat Password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        className={styles.input}
                    />


                </form>

            </div>
            {/* Submit button */}
            <div className={styles.buttonContainer3}>
                <button type="submit" className={styles.button2} onClick={() => changePW()}>
                    Change Password
                </button>
            </div>

        </div>
    );
}

