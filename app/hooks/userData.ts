import { useEffect, useState } from 'react';

// Define the User type, which can either be an object or null
export type User = {
    id: number;
    email: string;
    username: string;
} | null;

export default function useAuth() {
    // Initialize user state as null (no user logged in initially)
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true); // State to manage loading status

    // Function to fetch user data from the server
    async function fetchUser() {
        try {
            // Make a GET request to fetch the user data from the API
            const res = await fetch("/api/auth/user");

            // Check if the response is not successful
            if (!res.ok) {
                setUser(null); // If not successful, set user to null
                console.log("User not found");
                return;
            } else {
                // If the response is successful, parse the JSON data
                const data = await res.json();
                console.log("Fetched user data:", data);

                // If the data contains a user object, set the user state
                if (data && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null); // If no user data is found, set user to null
                }
            }
        } catch (err) {
            // If an error occurs while fetching, log the error and set user to null
            console.error("An error occurred while fetching user data", err);
            setUser(null);
        }
        finally{
            setLoading(false); // Set loading to false no matter what
        }
    }

    useEffect(() => {
        // Call the fetchUser function when the component mounts
        fetchUser();
    }, []);

    // Return the user state so it can be used in other components
    return { user, loading, refetchUser: fetchUser };
}