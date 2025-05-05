import styles from '@/components/styles/review.module.css';
import { useState, useEffect } from 'react';
import { useUser } from '@/app/hooks/userContext';

// Define the type for the props the component expects
interface RevisionSetupPageProps {
    onNoteSelect: (note: Note | undefined) => void // Function to handle note and option selection
}

export type Note = {
    note_id: number; // Unique identifier for the note
    note_title: string; // Title of the note
}


export default function revisionSetupPage({ onNoteSelect }: RevisionSetupPageProps) {
    const [courses, setCourses] = useState<{ course_id: number; course_name: string }[]>([]); // For storing the list of courses
    const [notes, setNotes] = useState<Note[]>([]); // For storing the list of notes
    const { user } = useUser();
    const userId = user?.id; // Get the user ID from the context
    const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined); // State to hold the selected note ID
    const [selectedCourse, setSelectedCourse] = useState<number | undefined>(undefined); // State to hold the selected course ID


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

    // Function to fetch the notes for the selected course
    const fetchNotes = async () => {
        try {
            // Make API request to fetch notes associated with the course
            const response = await fetch(`/api/notes?course_id=${selectedCourse}`);
            const data = await response.json(); // Parse the response data
            setNotes(data); // Store the fetched notes in state
        } catch (error) {
            // If an error occurs, log it to the console
            console.error("Error fetching notes:", error);
        }
    };

    // Fetch courses when the component mounts or when the userId changes
    useEffect(() => {
        if (selectedCourse) fetchNotes(); // Call fetchCourses if userId is available
    }, [selectedCourse]);





    return (
        <div className={styles.pageContainer}>
           <h1 className={styles.title}> Revise with Recall assistant </h1> 
            <div className={styles.selectContainer}>
                <div className={styles.card}>
                <h2> Choose a subject to review </h2>
                <select
                    onChange={(e) => setSelectedCourse(Number(e.target.value))} // Update selectedCourse on change
                    className={styles.selectInput} // Apply styling from CSS module
                >
                    <option value="" >Select course</option> {/* Disabled placeholder option */}
                    {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.course_name} {/* Display each course as an option */}
                        </option>
                    ))}
                </select>
            
            <h2> Choose a topic: </h2>
            <select
                className={styles.selectInput} // Apply styling from CSS module
                onChange={(e) => {
                    const selectedNote = notes.find(note => note.note_id === Number(e.target.value));
                    setSelectedNote(selectedNote); // Update selectedNote with the selected note object
                }} // Update selectedNoteID on change
            >
                <option value="" >Select note</option> {/* Disabled placeholder option */}
                {notes.map((note) => (
                    <option key={note.note_id} value={note.note_id}>
                        {note.note_title} {/* Display each note as an option */}
                    </option>
                ))}
            </select>
            <button className={styles.button}  onClick={() => {
                if (selectedNote != undefined ) {
                    onNoteSelect(selectedNote);
                }
                else {
                    alert("Please select a note to proceed.");
                }
            }}>
                Start Revising
            </button>
            </div>
            </div>
        </div>
    );
}