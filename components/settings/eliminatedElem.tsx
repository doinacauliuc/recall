
import styles from "@/components/styles/settings.module.css";
import { useEffect, useState } from "react"; // React hooks for managing state and lifecycle
import { useUser } from "@/app/hooks/userContext"; // Custom hook to get user context
import { FlashcardSet } from "@/components/pages/flashcards/setList"
import { Note } from "@/components/pages/notes/notesList"
import { ArchiveRestore } from 'lucide-react';

interface EliminatedElementsPageProps {
    onBack: () => void;
}


export default function EliminatedElementsPage({ onBack }: EliminatedElementsPageProps) {
    const { user } = useUser(); // Access user context to get user data
    const [sets, setSets] = useState<FlashcardSet[]>([]); // State to store list of sets
    const [notes, setNotes] = useState<Note[]>([]); // State to hold the list of notes
    const [courses, setCourses] = useState<{ course_id: number; course_name: string }[]>([]); // For storing the list of courses
    const [loading, setLoading] = useState(false); // Loading state to disable the button during API call
    const userId = user?.id; // Get the user ID from the context (make sure user is authenticated)
    const [error, setError] = useState(""); // State for managing error messages
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);


    // Fetch the eliminated elements related to the user from the API
    const fetchDeletedElements = async () => {
        try {
            // Fetch elements from the server using the userId as query parameter
            const response = await fetch(`/api/settings?userId=${userId}`);
            const data = await response.json(); // Parse the response data
            setSets(data.sets); // Update the sets state with fetched data
            setNotes(data.notes);
        } catch (error) {
            console.error("Error fetching courses:", error); // Log error if fetching fails
        }
    };


    // Function to fetch courses associated with the user
    const fetchCourses = async () => {
        try {
            // Fetch the courses from the server using the user ID
            const response = await fetch(`/api/courses?userId=${userId}`);
            const data = await response.json();
            setCourses(data); // Update the courses state with the fetched data
        } catch (error) {
            console.error("Error fetching courses:", error); // Log error if fetching courses fails
        }
    };

    // Fetch sets when the component mounts or when userId changes
    useEffect(() => {
        if (userId) fetchDeletedElements(); // Only fetch if userId is available (user is logged in)
        fetchCourses();
    }, [userId]);


    const restoreEliminatedSets = async (setId: number) => {
        // Set loading state to true
        setLoading(true);

        try {
            // Send a PUT request to restore the set to the database
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


            console.log("Password changed") // Log successful operation
        } catch (err) {
            console.error("Error changing password:", err); // Log error to the console
            setError("Failed to change password."); // Display an error message
        } finally {
            setLoading(false); // Set loading to false after the operation is complete
        }
    };

    const restoreEliminatedNotes = async (noteId: number, courseId: number) => {
        // Set loading state to true
        setLoading(true);

        try {
            // Send a PUT request to restore the note to the database
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ option: "restoreNote", note_id: noteId, course_id: courseId }),
            });

            console.log(res);
            // If the request fails, throw an error
            if (!res.ok) {
                throw new Error("Failed to change password.");
            } else {
                fetchDeletedElements();
            }


            console.log("Password changed") // Log successful operation
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
                            key={set?.set_id} // Unique key for each set
                            className={styles.card2}
                        >
                            <h2 className={styles.element}>{set?.set_name}</h2>
                            {/* Set title which triggers set selection */}
                            <button onClick={() => restoreEliminatedSets(set?.set_id!)}>
                                {/* Button to restore the course */}
                                <ArchiveRestore /> {/* Restore icon */}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No sets available</p> // Message when there are no sets
                )}

                <h2 className={styles.title2}>Notes</h2>
                {notes?.length > 0 ? (
                    notes.map((note) => {
                        const isSelectVisible = selectedNoteId === note?.note_id;

                        return (
                            <div key={note?.note_id} className={styles.card2}>
                                <h2 className={styles.element}>{note?.note_title}</h2>

                                {/* Button to view the select button */}
                                {!isSelectVisible && (
                                    <button
                                        onClick={() => setSelectedNoteId(note?.note_id!)}
                                    >
                                        <ArchiveRestore />
                                    </button>
                                )}

                                {/* Select visible only if the button has been clicked */}
                                {isSelectVisible && (
                                    <select
                                        onChange={(e) => {
                                            const selectedCourseId = Number(e.target.value);
                                            if (selectedCourseId) {
                                                restoreEliminatedNotes(note.note_id!, selectedCourseId);
                                                setSelectedNoteId(null); // Hides the select after the selection
                                            }
                                        }}
                                        className={styles.selectInput}
                                    >
                                        <option value="">Select course</option>
                                        {courses.map((course) => (
                                            <option key={course.course_id} value={course.course_id}>
                                                {course.course_name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>No notes available</p>
                )}

            </div>

            <button className={styles.backButton} onClick={onBack}>
                Back to Settings
            </button>

        </div>
    );
}