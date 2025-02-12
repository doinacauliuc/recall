"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./styles/navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <Link href="/">
          <img src="/logo-box.svg" alt="Recall Logo" className={styles.logo} />
        </Link>
      </div>

      {/* Hamburger Menu Button (Visible on Small Screens) */}
      <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Navigation Links */}
      <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
        <Link href="/" className={styles.links}>Functionalities</Link>
        <Link href="/" className={styles.links}>Resources</Link>
        {/* Buttons */}
      <div className={styles.buttonContainer}>
        <Link href="/login">
          <button className={styles.button}>Login</button>
        </Link>
        <Link href="/signup">
          <button className={styles.button}>Signup</button>
        </Link>
      </div>
      </div>

      
    </nav>
  );
}
