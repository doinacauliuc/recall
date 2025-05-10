"use client"; // This directive ensures the component runs on the client side.

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserProvider } from '@/app/hooks/userContext';
import fetchUser from "@/app/hooks/userData"; // Importing the fetchUser function

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
  const { user } = fetchUser(); // Accessing user context

  // State to track the currently active page
  const [activePage, setActivePage] = useState("dashboard");

  // Router instance for navigation
  const router = useRouter();

  //Timer Logic defined in parent component to preserve state
  // Timer state variables
  const [workDuration, setWorkDuration] = useState(25); // default 25 minutes
  const [breakDuration, setBreakDuration] = useState(5); // default 5 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(workDuration * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionJustLoggedRef = useRef(false);


  // Sync duration when props change
  useEffect(() => {
    // Only reset the timer if it's NOT running and durations changed
    if (!isRunning) {
      setSecondsLeft(isWorkSession ? workDuration * 60 : breakDuration * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workDuration, breakDuration]);

  const loadSessionData = async (duration: number) => {
    const res = await fetch("/api/study-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id,
        duration: duration,

      }),
    });
    if (!res.ok) {
      throw new Error("Failed to load session data");
    }

  }
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds <= 1) {
          // Determine next session
          const nextIsWorkSession = !isWorkSession;
          const nextDuration = nextIsWorkSession ? workDuration * 60 : breakDuration * 60;

          // ✅ Only log if the session ending was a work session AND we haven't logged it yet
          if (isWorkSession && !sessionJustLoggedRef.current) {
            loadSessionData(workDuration); // Log study session
            sessionJustLoggedRef.current = true;
          }

          // Reset session flag if we're entering a work session
          if (nextIsWorkSession) {
            sessionJustLoggedRef.current = false;
          }

          setIsWorkSession(nextIsWorkSession);
          return nextDuration;
        }

        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [isRunning, isWorkSession, workDuration, breakDuration]);



  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(isWorkSession ? workDuration * 60 : breakDuration * 60);
  };



  // Object mapping page names to their respective components
  const pages: { [key: string]: JSX.Element } = {
    dashboard: <DashboardPage
      workDuration={workDuration}
      breakDuration={breakDuration}
      isRunning={isRunning}
      isWorkSession={isWorkSession}
      secondsLeft={secondsLeft}
      setWorkDuration={setWorkDuration}
      setBreakDuration={setBreakDuration}
      onStart={handleStart}
      onPause={handlePause}
      onReset={handleReset}
    />,
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
        <div className={styles.componentsContainer}>
          {/* Sidebar for navigation */}
          <Sidenav setActivePage={setActivePage} />
          {/* Navbar for top navigation */}
          <Navbar />
        </div>
        <div className={styles.contentContainer}>
          {/* Render the active page or default to the Dashboard */}
          {pages[activePage] || <DashboardPage
            workDuration={workDuration}
            breakDuration={breakDuration}
            isRunning={isRunning}
            isWorkSession={isWorkSession}
            secondsLeft={secondsLeft}
            setWorkDuration={setWorkDuration}
            setBreakDuration={setBreakDuration}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />}

        </div>
      </UserProvider>
    </div>
  );
}

