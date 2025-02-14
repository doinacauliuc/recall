"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotesPage from "@/components/pages/notes";
import FlashcardPage from "@/components/pages/flashcards";
import DashboardPage from "@/components/pages/dashboard";
import RevisePage from "@/components/pages/revise";
import Sidenav from "@/components/sidenav";
import Navbar from "@/components/navbar";
import styles from "./dashboard.module.css";
import { sessionCheck } from "@/app/hooks/sessionCheck";
import { JSX } from "react/jsx-runtime";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const [activePage, setActivePage] = useState("dashboard");

  const pages: { [key: string]: JSX.Element } = {
    dashboard: <DashboardPage />,
    notes: <NotesPage />,
    flashcards: <FlashcardPage />,
    revise: <RevisePage />
  };
 
  useEffect(() => {
    async function checkAuth() {
      const auth = await sessionCheck();
      setIsAuthenticated(auth);
      if (!auth) {
        router.replace("/"); // Use replace() to prevent going back to the dashboard with browser history
      }
    }
    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return <div></div>; // Prevent rendering the protected UI until auth is checked
  }

  if (!isAuthenticated) {
    return null; // Prevents flashing UI before redirect
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.componentsContainer}>
        <Sidenav setActivePage={setActivePage} />
        <Navbar />
      </div>
      <div className={styles.contentContainer}>
      {pages[activePage] || <DashboardPage />} {/* Default to Dashboard */}
      </div>
    </div>
  );
}
