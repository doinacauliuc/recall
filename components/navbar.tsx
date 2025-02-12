
import styles from './styles/navbar.module.css';
import { useUser } from "@/app/hooks/useUser";
import { type User } from "@/app/hooks/useAuth"

export default function Navbar() {
    const { user, loading } = useUser();    
    return (
        <div>
            <nav className={styles.navbar}>
                <h1 className={styles.welcomeMessage}>Hello, {user?.username} </h1>
            </nav>
        </div>
    );
}