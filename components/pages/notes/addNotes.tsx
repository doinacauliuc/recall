"use client";

import { useUser } from "@/app/hooks/userContext"; // Import custom hook to access user context
import styles from "@/components/styles/pages.module.css"; // Import the CSS module for styling
import { useEffect, useState, useRef} from "react"; // Import React hooks
import Quill from "quill"; // Import Quill
import 'quill/dist/quill.bubble.css'; // Import Quill's snow theme CSS


        
export default function AddNotesPage() {
    // State variables for managing note title, content, error messages, loading status, selected course, and fetched courses
    const [noteTitle, setNoteTitle] = useState(""); // For storing the title of the note
    const [noteContent, setNoteContent] = useState(""); // For storing the content of the note
    const [error, setError] = useState(""); // For storing any error messages
    const [loading, setLoading] = useState(false); // For managing the loading state when adding a note
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null); // For storing the selected course ID
    const [courses, setCourses] = useState<{ course_id: number; course_name: string }[]>([]); // For storing the list of courses
    const { user } = useUser(); // Access user context to get the logged-in user's data
    const userId = user?.id; // Get the user ID from the context
    const [quillInstance, setQuillInstance] = useState<Quill | null>(null); // State to store the Quill instance


   // Use the specific HTMLDivElement type for the ref
   const quillRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (quillRef.current && !(quillRef.current as any).__initialized) {
            console.log("Initializing Quill editor");

            // Mark the editor as initialized to prevent reinitialization
            (quillRef.current as any).__initialized = true;

            const quill = new Quill(quillRef.current, {
                theme: "bubble",
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                    ],
                },
            });

            // Set the Quill instance to the state
            setQuillInstance(quill);

            quill.on("text-change", () => {
                setNoteContent(quill.root.innerHTML); // Update the note content 
            });
        }
    }, []); // Empty dependency array ensures it only runs once

    // Function to handle adding a new note
    const addNote = async () => {
        // Validate if the note title is provided
        if (!noteTitle.trim()) {
            setError("Course title cannot be empty."); // Show an error message if title is empty
            return;
        }

        // Set loading state to true and clear previous errors
        setLoading(true);
        setError("");

        try {
            // Send a POST request to add the note to the database
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note_title: noteTitle, content: noteContent, course_id: selectedCourse }),
            });

            // If the request fails, throw an error
            if (!res.ok) {
                throw new Error("Failed to add note.");
            }

            setNoteTitle(""); // Reset note title input after successful creation
            setNoteContent(""); // Reset note content input
            if (quillInstance) {
                quillInstance.setText(''); // Clear the text in the editor
            }
            console.log("New note created") // Log successful note creation
        } catch (err) {
            console.error("Error adding note:", err); // Log error to the console
            setError("Failed to add note."); // Display an error message
        } finally {
            setLoading(false); // Set loading to false after the operation is complete
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

    // Fetch courses when the component mounts or when the userId changes
    useEffect(() => {
        if (userId) fetchCourses(); // Call fetchCourses if userId is available
    }, [userId]);

    return (
        <div className={styles.pageContainer}> {/* Main container for the page */}
            <h1 className={styles.title}>Add Note</h1> {/* Page title */}
            <div className={styles.noteInputContainer}> {/* Container for note title and course selector */}
                <input
                    type="text"
                    placeholder="New note title" // Placeholder text
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)} // Update noteTitle state on input change
                    className={styles.titleInput} // Apply styling from CSS module
                />
                <select
                    value={selectedCourse ?? ""} // If no course is selected, display an empty value
                    onChange={(e) => setSelectedCourse(Number(e.target.value))} // Update selectedCourse on change
                    className={styles.selectInput} // Apply styling from CSS module
                >
                    <option value="" disabled className={styles.select}>Select course</option> {/* Disabled placeholder option */}
                    {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.course_name} {/* Display each course as an option */}
                        </option>
                    ))}
                </select>
                <button className={styles.button} onClick={addNote}> Add </button> {/* Button to trigger addNote function */}
            </div>
            <div>
                <div 
                    ref={quillRef} 
                    style={{
                        height: '500px',
                        width: '900px',
                    }}
                    className={styles.contentInput}
                /> {/* Quill editor container */}
            </div>
        </div>
    );
}

