import { useState } from 'react';
import Link from 'next/link';
import "./Navbar.css";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    // Call the logout API to remove the token
    await fetch("/api/auth/logout", {
      method: "GET", // You can use POST if preferred
    });

    // Redirect the user to the login page after logout
    router.push("/login");
  };

  

  return (
      <div>
          <nav className="navbar">
              <Link href="/dashboard">
                  <img src="/logo.svg" alt="Logo" className='logo' />
              </Link>
              <button onClick={handleLogout} className='button'>Logout</button>
          </nav>
      </div>
  );
}