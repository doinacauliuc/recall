import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './navbar.css';

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
            <nav className={'navbar'}>
                <Link href={'/'}>
                    <img src={'/logo-box.svg'} alt={'Recall Logo'} className={'logo'} />
                </Link>
                <button className={'button'} onClick={handleLogout}>Log out</button>

            </nav>
        </div>
    );
}