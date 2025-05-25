import { useEffect, useState } from "react"; // Import React hooks for state management and side effects
import styles from "@/components/styles/pages.module.css"; // Import CSS styles for the component
import { Trash2, ArrowLeft } from 'lucide-react'; // Import Trash icon from lucide-react for delete button


// Define the type for a note
export type Note = {
    note_id: number; // Unique identifier for the note
    note_title: string; // Title of the note
    note_content: string; // Content of the note
    course_id: number;
} | null; // Allow null if no note is selected

// Define the props the NotesListPage component expects
interface NotesListPageProps {
    course: { course_name: string; course_id: number }; // Course data containing name and ID
    onNoteSelect: (note_id: number) => void; // Function to handle note selection by ID
    onBack: () => void; // Function to go back to the course selection page
}

// The component responsible for displaying the list of notes for a selected course
export default function NotesListPage({ course, onBack, onNoteSelect }: NotesListPageProps) {
    const [notes, setNotes] = useState<Note[]>([]); // State to hold the list of notes
    const courseID = course.course_id; // Extract the course ID for fetching notes

    // Function to fetch the notes for the selected course
    const fetchNotes = async () => {
        try {
            // Make API request to fetch notes associated with the course
            const response = await fetch(`/api/notes?course_id=${courseID}`);
            const data = await response.json(); // Parse the response data
            setNotes(data); // Store the fetched notes in state
        } catch (error) {
            // If an error occurs, log it to the console
            console.error("Error fetching notes:", error);
        }
    };

    // Use useEffect to fetch notes whenever the course ID changes
    useEffect(() => {
        if (courseID) fetchNotes(); // Fetch notes if course ID exists
    }, [courseID]); // Re-run the effect when courseID changes


    // Function to delete a note
    const deleteNote = async (noteId: number | undefined) => {
        try {
            // Send a DELETE request to remove the course
            const res = await fetch("/api/notes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note_id: noteId }), // Pass the courseId to delete the specific course
            });

            if (res.ok) {
                fetchNotes(); // If the delete was successful, fetch the updated list of courses
            }

        } catch (error) {
            console.error("Error deleting course:", error); // Log error if deletion fails
        }
    };

    return (
        <div className={styles.pageContainer}>
            {/* Button to navigate back to the Courses page */}
            <button onClick={onBack} className={styles.button}> Back to Courses </button>

            {/* Display the selected course name */}
            <h1 className={styles.title}>{course.course_name.toUpperCase()}</h1>

            {/* Container for displaying the list of notes */}
            <div className={styles.cardsContainer}>
                {notes?.length > 0 ? (
                    // If notes are available, map through them and display each note
                    notes.map((note) => (
                        <div
                            key={note?.note_id} // Use note ID as the unique key
                            className={styles.card} // Style the note card

                        >
                            <h2 className={styles.element}
                                onClick={() => note && onNoteSelect(note.note_id)} // Call onNoteSelect when note is clicked
                            >{note?.note_title}</h2> {/* Display the note title */}
                            {/* Note title which triggers note selection */}
                            <button onClick={() => deleteNote(note?.note_id)}>
                                {/* Button to delete the note */}
                                <Trash2 /> {/* Trash icon */}
                            </button>
                        </div>

                    ))
                ) : (
                    // If no notes are available, display a message
                    <p>No notes available for this course</p>
                )}
            </div>
        </div>
    );
}
