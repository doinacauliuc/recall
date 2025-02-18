import { useEffect, useState } from "react"; // React hooks for managing state and lifecycle
import styles from "@/components/styles/pages.module.css"; // Import custom CSS module for styling
import { useUser } from "@/app/hooks/userContext"; // Custom hook to get user context
import { Trash2 } from 'lucide-react'; // Import Trash icon from lucide-react for delete button


// Define Course type, it may be null if no course exists
export type FlashcardSet = {
    set_name: string;
    set_id: number;
} | null;

// Define the type for the props the component expects
interface FlashcardSetsPageProps {
    onSetSelect: (set: { set_name: string; set_id: number }) => void; // Function to handle set selection
}


export default function FlashcardSetsPage({ onSetSelect }: FlashcardSetsPageProps) {
    const { user } = useUser(); // Access user context to get user data
    const [sets, setSets] = useState<FlashcardSet[]>([]); // State to store list of sets
    const [newSetTitle, setNewSetTitle] = useState(""); // State to manage the new set title input
    const [loading, setLoading] = useState(false); // Loading state to disable the button during API call
    const userId = user?.id; // Get the user ID from the context (make sure user is authenticated)
    const [error, setError] = useState(""); // State for managing error messages


    // Fetch the sets related to the user from the API
    const fetchSets = async () => {
        try {
            // Fetch courses from the server using the userId as query parameter
            const response = await fetch(`/api/sets?userId=${userId}`);
            const data = await response.json(); // Parse the response data
            setSets(data); // Update the courses state with fetched data
        } catch (error) {
            console.error("Error fetching courses:", error); // Log error if fetching fails
        }
    };

    // Fetch sets when the component mounts or when userId changes
    useEffect(() => {
        if (userId) fetchSets(); // Only fetch if userId is available (user is logged in)
    }, [userId]);

    // Function to add a new course
    const addSet = async () => {
        // Validate if the course title is empty
        if (!newSetTitle.trim()) {
            setError("Set title cannot be empty."); // Display error if empty
            return;
        }

        setLoading(true); // Set loading to true when starting to add a set
        setError(""); // Clear any previous error messages

        try {
            // Send a POST request to add a new course to the database
            const res = await fetch("/api/sets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ set_name: newSetTitle, user_id: userId }), // Send the course name and user ID
            });

            if (!res.ok) {
                throw new Error("Failed to add set."); // Throw an error if the request fails
            }

            const newSet = await res.json(); // Parse the response to get the new set data
            setSets([...sets, newSet]); // Add the new set to the UI
            setNewSetTitle(""); // Reset the set title input field
            await fetchSets(); // Fetch sets again to update the list
        } catch (err) {
            console.error("Error adding set:", err); // Log error if adding fails
            setError("Failed to add set."); // Display error message
        } finally {
            setLoading(false); // Set loading to false after the operation is complete
        }
    };

    // Function to delete a course
    const deleteSet = async (setID: number | undefined) => {
        try {
            // Send a DELETE request to remove the course
            const res = await fetch("/api/sets", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ set_id: setID }), // Pass the courseId to delete the specific set
            });

            if (res.ok) {
                fetchSets(); // If the delete was successful, fetch the updated list of set
            } else {
                // If deletion fails, show an alert (sets must be empty to be deleted)
                alert("Only empty sets can be deleted. Please make sure there are no flashcards associated to the set before deleting.");
            }
        } catch (error) {
            console.error("Error deleting set:", error); // Log error if deletion fails
        }
    };


    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Flashcard Sets</h1> {/* Title for the page */}
            
            {/* Input Field to Add a New Flashcard Set */}
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Add new set" // Placeholder text
                    value={newSetTitle}
                    onChange={(e) => setNewSetTitle(e.target.value)} // Update input value
                    className={styles.input}
                />
                <button onClick={addSet} disabled={loading} className={styles.button}>
                    {loading ? "Adding..." : "Add Set"} {/* Button text changes based on loading state */}
                </button>
            </div>

            {/* Display error message if any */}
            {error && <p className={styles.error}>{error}</p>}
            
            {/* Display the list of courses */}
            <div className={styles.cardsContainer}>
                {sets?.length > 0 ? (
                    sets.map((set) => (
                        <div
                            key={set?.set_id} // Unique key for each course card
                            className={styles.card}
                        >
                            <h2 className={styles.element} onClick={() => set && onSetSelect(set)}>{set?.set_name}</h2>
                            {/* Course title which triggers course selection */}
                            <button onClick={() => deleteSet(set?.set_id)}> 
                                {/* Button to delete the course */}
                                <Trash2 /> {/* Trash icon */}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No sets available</p> // Message when there are no courses
                )}
            </div>
        </div>
    );
}
