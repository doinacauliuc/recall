import styles from '@/components/styles/pages.module.css';
import { useState, useEffect } from 'react';
import { useUser } from '@/app/hooks/userContext';

export default function RevisePage() {
    const [courses, setCourses] = useState<{ course_id: number; course_name: string }[]>([]); // For storing the list of courses
    const [notes, setNotes] = useState<{note_id: number; note_title: string} [] >([]); // State to hold the list of notes
    const { user } = useUser();
    const userId = user?.id; // Get the user ID from the context
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null); // For storing the selected course ID


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
            <h1 className={styles.title}>{user?.username}</h1>

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

            <select
                //value={selectedCourse ?? ""} // If no course is selected, display an empty value
                //onChange={(e) => setSelectedCourse(Number(e.target.value))} // Update selectedCourse on change
                className={styles.selectInput} // Apply styling from CSS module
            >
                <option value=""  className={styles.select}>Select note</option> {/* Disabled placeholder option */}
                {notes.map((note) => (
                    <option key={note.note_id} value={note.note_id}>
                        {note.note_title} {/* Display each course as an option */}
                    </option>
                ))}
            </select>
        </div>
    );
}