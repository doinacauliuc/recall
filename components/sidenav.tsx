"use client";
import styles from './styles/sidernav.module.css'
import { LayoutDashboard, NotebookText, CreditCard, MessageSquareText, Settings, PencilLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function Sidenav({ setActivePage }: { setActivePage: (page: string) => void }) {
    
    const router = useRouter();
    
    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "GET" });
        router.push("/");
    };

    return (
        <section className={styles.sidenav}>
            <div className={styles.pagesContainer}>
                <Link href='/'>
                    <img src="/logo-box.svg" alt="logo" className={styles.logo} />
                </Link>
                <div className={styles.pagelink} onClick={() => setActivePage("dashboard")}>
                    <LayoutDashboard />
                    <h1>Dashboard</h1>
                </div>
                <div className={styles.pagelink} onClick={() => setActivePage("viewNotes")}>
                    <NotebookText />
                    <h1>Browse Notes</h1>
                </div>
                <div className={styles.pagelink} onClick={() => setActivePage("addNotes")}>
                    <PencilLine />
                    <h1>Add Notes</h1>
                </div>
                <div className={styles.pagelink} onClick={() => setActivePage("flashcards")}>
                    <CreditCard />
                    <a href="#">Flashcards</a>
                </div>
                <div className={styles.pagelink} onClick={() => setActivePage("revise")}>
                    <MessageSquareText />
                    <h1>Revise</h1>
                </div>
            </div>
            <div className={styles.utilitiesContainer}>
                <div className={styles.pagelink}>
                    <Settings />
                    <h1>Settings</h1>
                </div>
                <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
            </div>
        </section>
    );
}
