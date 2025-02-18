"use client"; // Ensures the component is rendered only on the client-side

import styles from './styles/navbar.module.css'; // Import the custom CSS for styling the navbar
import { useUser } from "@/app/hooks/userContext"; // Import custom hook to access the user context (user information)

export default function Navbar() {
    // Destructure the 'user' object from the useUser hook
    const { user } = useUser();

    return (
        <div>
            <nav className={styles.navbar}> {/* Main navbar container */}
                {/* Conditional rendering of the user's username if available */}
                <h1 className={styles.welcomeMessage}>Hello, {user?.username}</h1>
            </nav>
        </div>
    );
}
