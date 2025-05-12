
import styles from "@/components/styles/settings.module.css";
import { useEffect, useState } from "react"; // React hooks for managing state and lifecycle
import { useUser } from "@/app/hooks/userContext"; // Custom hook to get user context
import { FlashcardSet } from "@/components/pages/flashcards/setList"
import { Note } from "@/components/pages/notes/notesList"
import { ArchiveRestore } from 'lucide-react';

interface EliminatedElementsPageProps {
    // set: { set_name: string; set_id: number }; // Course data containing name and ID
    onBack: () => void;
}


export default function EliminatedElementsPage({ onBack }: EliminatedElementsPageProps) {
    const { user } = useUser(); // Access user context to get user data
    const [sets, setSets] = useState<FlashcardSet[]>([]); // State to store list of sets
    const [notes, setNotes] = useState<Note[]>([]); // State to hold the list of notes
    const [loading, setLoading] = useState(false); // Loading state to disable the button during API call
    const userId = user?.id; // Get the user ID from the context (make sure user is authenticated)
    // const setID = set.set_id; // Extract the set ID for fetching flashcards 
    const [error, setError] = useState(""); // State for managing error messages


    // Fetch the sets related to the user from the API
    const fetchDeletedElements = async () => {
        try {
            // Fetch courses from the server using the userId as query parameter
            const response = await fetch(`/api/settings?userId=${userId}`);
            const data = await response.json(); // Parse the response data
            setSets(data.sets); // Update the courses state with fetched data
            setNotes(data.notes);
        } catch (error) {
            console.error("Error fetching courses:", error); // Log error if fetching fails
        }
    };

    // Fetch sets when the component mounts or when userId changes
    useEffect(() => {
        if (userId) fetchDeletedElements(); // Only fetch if userId is available (user is logged in)
    }, [userId]);


    const restoreEliminatedSets = async (setId: number) => {
        // Set loading state to true and clear previous errors
        setLoading(true);


        try {
            // Send a PUT request to change the knowledge to the database
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ option: "restoreSet", set_id: setId }),
            });

            console.log(res);
            // If the request fails, throw an error
            if (!res.ok) {
                throw new Error("Failed to change password.");
            } else {
                fetchDeletedElements();
            }


            console.log("Password changed") // Log successful decrement knowledge
        } catch (err) {
            console.error("Error changing password:", err); // Log error to the console
            setError("Failed to change password."); // Display an error message
        } finally {
            setLoading(false); // Set loading to false after the operation is complete
        }
    };

    const restoreEliminatedNotes = async (noteId: number) => {
        // Set loading state to true and clear previous errors
        setLoading(true);


        try {
            // Send a PUT request to change the knowledge to the database
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ option: "restoreNote", note_id: noteId }),
            });

            console.log(res);
            // If the request fails, throw an error
            if (!res.ok) {
                throw new Error("Failed to change password.");
            } else {
                fetchDeletedElements();
            }


            console.log("Password changed") // Log successful decrement knowledge
        } catch (err) {
            console.error("Error changing password:", err); // Log error to the console
            setError("Failed to change password."); // Display an error message
        } finally {
            setLoading(false); // Set loading to false after the operation is complete
        }
    };



    return (
        <div className={styles.pageContainer}>

            <h2 className={styles.title}>Eliminated Elements</h2>
            <div className={styles.cardsContainer}>
                <h2 className={styles.title2}>Sets</h2>
                {sets?.length > 0 ? (
                    sets.map((set) => (
                        <div
                            key={set?.set_id} // Unique key for each course card
                            className={styles.card2}
                        >
                            <h2 className={styles.element}>{set?.set_name}</h2>
                            {/* Course title which triggers course selection */}
                            <button onClick={() => restoreEliminatedSets(set?.set_id!)}>
                                {/* Button to delete the course */}
                                <ArchiveRestore /> {/* Trash icon */}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No sets available</p> // Message when there are no courses
                )}

                <h2 className={styles.title2}>Notes</h2>
                {notes?.length > 0 ? (
                    // If notes are available, map through them and display each note
                    notes.map((note) => (
                        <div
                            key={note?.note_id} // Use note ID as the unique key
                            className={styles.card2} // Style the note card

                        >
                            <h2 className={styles.element}>{note?.note_title}</h2> {/* Display the note title */}
                            {/* Note title which triggers note selection */}
                            <button onClick={() => restoreEliminatedNotes(note?.note_id!)}>
                                {/* Button to delete the note */}
                                <ArchiveRestore /> {/* Trash icon */}
                            </button>
                        </div>

                    ))
                ) : (
                    // If no notes are available, display a message
                    <p>No notes available for this course</p>
                )}

            </div>
            <button className={styles.button} onClick={onBack}>
                Back to Settings
            </button>
        </div>
    );
}