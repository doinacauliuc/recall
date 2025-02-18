"use client";

import { useEffect, useState } from "react"; // React hooks for managing state and lifecycle
import styles from "@/components/styles/pages.module.css"; // Import custom CSS module for styling

// Define the types for the props the component expects
interface NoteDetailPageProps {
    note_id: number; // ID of the note to display
    onBack: () => void; // Function to handle navigating back to the previous page
}

export default function NoteDetailPage({ note_id, onBack }: NoteDetailPageProps) {
    const [note, setNote] = useState<{ note_title: string; content: string } | null>(null); // State to store the note data
    const [loading, setLoading] = useState(true); // Loading state to manage the UI while data is being fetched
    const [error, setError] = useState(""); // Error state to display error messages if something goes wrong

    // Fetch the note based on the note_id passed via props
    useEffect(() => {
        // Async function to fetch the note data from the API
        const fetchNote = async () => {
            try {
                // Make a request to fetch the note details using the note_id
                const response = await fetch(`/api/notes?note_id=${note_id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch note"); // If the request fails, throw an error
                }
                const data = await response.json(); // Parse the response into JSON
                setNote(data); // Set the note data into the state
            } catch (err) {
                setError("Error loading note"); // If there is an error, set the error message
                console.error("Error fetching note:", err); // Log the error to the console
            } finally {
                setLoading(false); // Set loading to false once the fetching is done (successful or not)
            }
        };

        fetchNote(); // Call the fetchNote function to get the data
    }, [note_id]); // Effect runs when the note_id prop changes

    // Return loading state while waiting for the API response
    if (loading) return <p>Loading...</p>;

    // Return error state if there is an issue fetching the note
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.pageContainer}>
            {/* Back button to return to the previous page */}
            <button onClick={onBack} className={styles.button}>Back to Notes</button>

            {/* Render the note details if the note exists */}
            {note ? (
                <>
                <h1 className={styles.title}>{note.note_title}</h1>
                {/* Render the content as HTML using dangerouslySetInnerHTML */}
                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: note.content }} // Inject HTML content
                />
            </>
            ) : (
                // If the note is not found, show this message
                <p>Note not found</p>
            )}
        </div>
    );
}
