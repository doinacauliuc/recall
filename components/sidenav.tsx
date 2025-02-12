
import styles from './styles/sidernav.module.css'
import { LayoutDashboard, NotebookText, Book, CreditCard, MessageSquareText, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
export default function Sidenav() {
    
     const router = useRouter();
    
        const handleLogout = async () => {
            // Call the logout API to remove the token
            await fetch("/api/auth/logout", {
                method: "GET", // You can use POST if preferred
            });
    
            // Redirect the user to the login page after logout
            router.push("/");
        };
    return (
        <section className={styles.sidenav}>
            <div className={styles.pagesContainer}>
                <Link href='/' >
                <img src="/logo-box.svg" alt="logo" className={styles.logo} />
                </Link>
                <div className={styles.pagelink}>
                    <LayoutDashboard />
                    <a href="#">Dashboard</a>
                </div>
                <div className={styles.pagelink}>
                    <NotebookText />
                    <a href="#">Notes</a>
                </div>
                <div className={styles.pagelink}>
                    <CreditCard />
                    <a href="#">Flashcards</a>
                </div>
                <div className={styles.pagelink}>
                    <MessageSquareText />
                    <a href="#">Revise</a>
                </div>
            </div>
                <div className={styles.utilitiesContainer}>
                <div className={styles.pagelink}>
                    <Settings />
                    <a href="#">Settings</a>
                </div>
                <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
                </div>
        </section>


    );

}