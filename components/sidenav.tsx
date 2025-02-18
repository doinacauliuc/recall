"use client"; // Ensures the component runs on the client side only

import styles from './styles/sidernav.module.css'; // Import custom CSS for styling the sidebar
import { LayoutDashboard, NotebookText, CreditCard, MessageSquareText, Settings, PencilLine } from 'lucide-react'; // Import icons from 'lucide-react' library
import { useRouter } from 'next/navigation'; // Import useRouter hook for programmatic navigation
import Link from "next/link"; // Import Link component for navigating between pages

// Sidenav component receives 'setActivePage' as a prop to change the active page in the main content area
export default function Sidenav({ setActivePage }: { setActivePage: (page: string) => void }) {
    
    const router = useRouter(); // Initialize useRouter to navigate to different routes programmatically
    
    // Function to handle logout, clears the user session and redirects to the homepage
    const handleLogout = async () => {
        // Call logout API endpoint
        await fetch("/api/auth/logout", { method: "GET" });
        // Redirect the user to the homepage after logout
        router.push("/");
    };

    return (
        <section className={styles.sidenav}> {/* Main container for the sidebar */}
            
            {/* Container for the page navigation links */}
            <div className={styles.pagesContainer}>
                
                {/* Logo link that navigates to the homepage */}
                <Link href='/'>
                    <img src="/logo-box.svg" alt="logo" className={styles.logo} />
                </Link>
                
                {/* Link to the Dashboard, sets the active page to "dashboard" when clicked */}
                <div className={styles.pagelink} onClick={() => setActivePage("dashboard")}>
                    <LayoutDashboard /> {/* Dashboard Icon */}
                    <h1>Dashboard</h1> {/* Dashboard text */}
                </div>
                
                {/* Link to the Browse Notes page, sets the active page to "viewNotes" when clicked */}
                <div className={styles.pagelink} onClick={() => setActivePage("viewNotes")}>
                    <NotebookText /> {/* Browse Notes Icon */}
                    <h1>Browse Notes</h1> {/* Browse Notes text */}
                </div>
                
                {/* Link to the Add Notes page, sets the active page to "addNotes" when clicked */}
                <div className={styles.pagelink} onClick={() => setActivePage("addNotes")}>
                    <PencilLine /> {/* Add Notes Icon */}
                    <h1>Add Notes</h1> {/* Add Notes text */}
                </div>
                
                {/* Link to the Flashcards page, sets the active page to "flashcards" when clicked */}
                <div className={styles.pagelink} onClick={() => setActivePage("flashcards")}>
                    <CreditCard /> {/* Flashcards Icon */}
                    <a href="#">Flashcards</a> {/* Flashcards text, currently with no URL */}
                </div>
                
                {/* Link to the Revise page, sets the active page to "revise" when clicked */}
                <div className={styles.pagelink} onClick={() => setActivePage("revise")}>
                    <MessageSquareText /> {/* Revise Icon */}
                    <h1>Revise</h1> {/* Revise text */}
                </div>
            </div>
            
            {/* Container for utility links such as Settings and Logout */}
            <div className={styles.utilitiesContainer}>
                
                {/* Settings page link */}
                <div className={styles.pagelink}>
                    <Settings /> {/* Settings Icon */}
                    <h1>Settings</h1> {/* Settings text */}
                </div>
                
                {/* Logout button, calls 'handleLogout' when clicked */}
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Logout {/* Logout text */}
                </button>
            </div>
        </section>
    );
}
