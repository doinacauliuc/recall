//Main dashboard page for the application

"use client"; // This directive ensures the component runs on the client side.

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserProvider } from '@/app/hooks/userContext';
import { TimerProvider } from "@/app/hooks/timerContext"; // Importing the TimerProvider

// Import various page components
import NoteBrowsingPage from "@/components/pages/notes/notesArchive";
import AddNotesPage from "@/components/pages/notes/addNotes";
import FlashcardPage from "@/components/pages/flashcards/flashcards";
import DashboardPage from "@/components/pages/dashboard";
import RevisePage from "@/components/revision/revise";
import Sidenav from "@/components/sidenav";
import SettingsPage from "@/components/settings/settings";
import Navbar from "@/components/navbar";

// Importing CSS styles
import styles from "./dashboard.module.css";


// Import the session check function
import { sessionCheck } from "@/app/hooks/sessionCheck";
import { JSX } from "react/jsx-runtime";

export default function Dashboard() {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // State to track the currently active page
  const [activePage, setActivePage] = useState("dashboard");

  // Router instance for navigation
  const router = useRouter();


  // Object mapping page names to their respective components
  const pages: { [key: string]: JSX.Element } = {
    dashboard: <DashboardPage/>,
    viewNotes: <NoteBrowsingPage />,
    addNotes: <AddNotesPage />,
    flashcards: <FlashcardPage />,
    revise: <RevisePage />,
    settings: <SettingsPage />,
  };

  // useEffect runs once when the component mounts to check user authentication
  useEffect(() => {
    async function checkAuth() {
      const auth = await sessionCheck(); // Call sessionCheck to verify authentication
      setIsAuthenticated(auth); // Update authentication state


      if (!auth) {
        router.replace("/"); // Redirect to home page if the user is not authenticated
      }
    }
    checkAuth(); // Call the authentication check function
  }, [router]); // Dependency array ensures this runs only when the router changes

  // Prevent rendering any UI until authentication is checked
  if (isAuthenticated === null) {
    return <div></div>; // Render an empty div while checking authentication
  }

  // If the user is not authenticated, render nothing to avoid UI flickering before redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.mainContainer}>
      <UserProvider>
        <TimerProvider>
          <div className={styles.componentsContainer}>
            {/* Sidebar for navigation */}
            <Sidenav setActivePage={setActivePage} />
            {/* Navbar for top navigation */}
            <Navbar />
          </div>
          <div className={styles.contentContainer}>
            {/* Render the active page or default to the Dashboard */}
            {pages[activePage] || <DashboardPage/>}

          </div>
        </TimerProvider>
      </UserProvider>
    </div>
  );
}

