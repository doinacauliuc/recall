
import styles from './styles/navbar.module.css';
import { useUser } from "@/app/hooks/userContext";

export default function Navbar() {
    const { user } = useUser();    
    return (
        <div>
            <nav className={styles.navbar}>
                <h1 className={styles.welcomeMessage}>Hello, {user?.username} </h1>
            </nav>
        </div>
    );
}