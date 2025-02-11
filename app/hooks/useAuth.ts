import { useEffect, useState } from 'react';

export type User = {
    id: number;
    email: string;
    username: string;
} | null;

export default function useAuth() {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me");
                if (!res.ok) {
                    setUser(null);
                    console.log("User not found");
                } else {
                    const data = await res.json();
                    console.log("Fetched user data:", data);
                    if (data && data.user) {
                        setUser(data.user);
                    } else {
                        setUser(null);
                    }
                }
            } catch (err) {
                console.error("An error occurred while fetching user data", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    return { user, loading };
}