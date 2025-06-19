"use client"; // Ensures this component runs only on the client side.

import { use, useEffect, useState } from "react";
import styles from "@/app/(auth)/form.module.css"; // Reuse the same styles
import Link from "next/link";


export default function RecoverPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [recoveryCode, setRecoveryCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [message, setMessage] = useState('Please enter your email to receive a recovery code.');





    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError(null);

        try {
            const res = await fetch('/api/auth/send-recovery-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('A recovery code has been sent to your email. Please check your inbox.');
                setStep(2); // Move to the next step if the request is successful                
            } else {
                setError(data.error || 'Recovery request failed.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        }
    };

    const handleCodeCheck = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError(null);

        if (newPassword !== newPasswordConfirm) {
            setError("Passwords do not match.");
            return;
        }

        console.log("Checking recovery code:", { email, recoveryCode, newPassword });
        try {
            const res = await fetch('/api/auth/check-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, recoveryCode, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setStep(3); // Move to the next step if the request is successful
                setMessage('Your password has been successfully reset. You can now log in with your new password.');
            } else {
                setError(data.error || 'Invalid recovery code or password reset failed.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        }

    };



    return (
        <div className={styles.Container}>
            <div className={styles.card}>
                <Link href="/">
                    <img src="/logo.svg" alt="Logo" className={styles.logo} />
                </Link>
                <h2 className={styles.title}>Password Reset</h2>
                <p className={styles.message}> {message}</p>
                <p className={styles.error}>{error}</p>

                {step === 3 && (
                    <div >
                        <Link href="/login" className={styles.button}>
                            <button className={styles.button}>
                                Go to Login
                            </button>
                        </Link>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleCodeCheck} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter your recovery code"
                            value={recoveryCode}
                            onChange={(e) => setRecoveryCode(e.target.value)}
                            className={styles.input}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm your new password"
                            value={newPasswordConfirm}
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            className={styles.input}
                            required
                        />

                        <button type="submit" className={styles.button}>
                            Change Password
                        </button>
                    </form>

                )}
                {step === 1 && (

                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div className={styles.formGroup}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.button}>
                            Send Recovery Code
                        </button>
                    </form>

                )}

            </div>
        </div >
    );
}
