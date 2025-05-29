"use client"; // Ensures that the component is only rendered on the client side

import { useState } from "react"; // Import useState hook to manage state in the component
import Link from "next/link"; // Import Link component for client-side navigation in Next.js
import styles from "./styles/navbar.module.css"; // Import custom CSS for styling the navbar

export default function Navbar() {
  // State to control the visibility of the mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}> {/* Main container for the navbar */}
      
      {/* Logo Section */}
      <div className={styles.logoContainer}>
        <Link href="/"> {/* Link to the homepage */}
          <img src="/logo-box.svg" alt="Recall Logo" className={styles.logo} /> {/* Logo image */}
        </Link>
      </div>

      {/* Hamburger Menu Button (Visible on Small Screens) */}
      <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}> 
        ☰ {/* Hamburger icon (3 horizontal lines) */}
      </div>

      {/* Navigation Links Section */}
      <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
        {/* Navigation links to different sections of the site */}
        <Link href="/functionalities" className={styles.links}>Overview</Link>

        {/* Buttons Section */}
        <div className={styles.buttonContainer}>
          {/* Login Button */}
          <Link href="/login">
            <button className={styles.button}>Login</button>
          </Link>
          
          {/* Signup Button */}
          <Link href="/signup">
            <button className={styles.button}>Signup</button>
          </Link>
        </div>
      </div>
      
    </nav>
  );
}
