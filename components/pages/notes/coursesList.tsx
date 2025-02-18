"use client";

import { useEffect, useState } from "react"; // React hooks for managing state and lifecycle
import styles from "@/components/styles/pages.module.css"; // Import custom CSS module for styling
import { useUser } from "@/app/hooks/userContext"; // Custom hook to get user context
import { Trash2 } from 'lucide-react'; // Import Trash icon from lucide-react for delete button


// Define Course type, it may be null if no course exists
export type Course = {
    course_name: string;
    course_id: number;
} | null;

// Define the type for the props the component expects
interface CoursesPageProps {
    onCourseSelect: (course: { course_name: string; course_id: number }) => void; // Function to handle course selection
}


export default function CoursesPage({ onCourseSelect }: CoursesPageProps) {
    const { user } = useUser(); // Access user context to get user data
    const [courses, setCourses] = useState<Course[]>([]); // State to store list of courses
    const [newCourseTitle, setNewCourseTitle] = useState(""); // State to manage the new course title input
    const [loading, setLoading] = useState(false); // Loading state to disable the button during API call
    const userId = user?.id; // Get the user ID from the context (make sure user is authenticated)
    const [error, setError] = useState(""); // State for managing error messages


    // Fetch the courses related to the user from the API
    const fetchCourses = async () => {
        try {
            // Fetch courses from the server using the userId as query parameter
            const response = await fetch(`/api/courses?userId=${userId}`);
            const data = await response.json(); // Parse the response data
            setCourses(data); // Update the courses state with fetched data
        } catch (error) {
            console.error("Error fetching courses:", error); // Log error if fetching fails
        }
    };

    // Fetch courses when the component mounts or when userId changes
    useEffect(() => {
        if (userId) fetchCourses(); // Only fetch if userId is available (user is logged in)
    }, [userId]);

    // Function to add a new course
    const addCourse = async () => {
        // Validate if the course title is empty
        if (!newCourseTitle.trim()) {
            setError("Course title cannot be empty."); // Display error if empty
            return;
        }

        setLoading(true); // Set loading to true when starting to add a course
        setError(""); // Clear any previous error messages

        try {
            // Send a POST request to add a new course to the database
            const res = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ course_name: newCourseTitle, user_id: userId }), // Send the course name and user ID
            });

            if (!res.ok) {
                throw new Error("Failed to add course."); // Throw an error if the request fails
            }

            const newCourse = await res.json(); // Parse the response to get the new course data
            setCourses([...courses, newCourse]); // Add the new course to the UI
            setNewCourseTitle(""); // Reset the course title input field
            await fetchCourses(); // Fetch courses again to update the list
        } catch (err) {
            console.error("Error adding course:", err); // Log error if adding fails
            setError("Failed to add course."); // Display error message
        } finally {
            setLoading(false); // Set loading to false after the operation is complete
        }
    };

    // Function to delete a course
    const deleteCourse = async (courseId: number | undefined) => {
        try {
            // Send a DELETE request to remove the course
            const res = await fetch("/api/courses", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ course_id: courseId }), // Pass the courseId to delete the specific course
            });

            if (res.ok) {
                fetchCourses(); // If the delete was successful, fetch the updated list of courses
            } else {
                // If deletion fails, show an alert (courses must be empty to be deleted)
                alert("Only empty courses can be deleted. Please make sure there are no notes associated with the course before deleting.");
            }
        } catch (error) {
            console.error("Error deleting course:", error); // Log error if deletion fails
        }
    };


    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Courses</h1> {/* Title for the page */}
            
            {/* Input Field to Add a New Course */}
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Add new course" // Placeholder text
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)} // Update input value
                    className={styles.input}
                />
                <button onClick={addCourse} disabled={loading} className={styles.button}>
                    {loading ? "Adding..." : "Add Course"} {/* Button text changes based on loading state */}
                </button>
            </div>

            {/* Display error message if any */}
            {error && <p className={styles.error}>{error}</p>}
            
            {/* Display the list of courses */}
            <div className={styles.cardsContainer}>
                {courses?.length > 0 ? (
                    courses.map((course) => (
                        <div
                            key={course?.course_id} // Unique key for each course card
                            className={styles.card}
                        >
                            <h2 className={styles.element} onClick={() => course && onCourseSelect(course)}>{course?.course_name}</h2>
                            {/* Course title which triggers course selection */}
                            <button onClick={() => deleteCourse(course?.course_id)}> 
                                {/* Button to delete the course */}
                                <Trash2 /> {/* Trash icon */}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No courses available</p> // Message when there are no courses
                )}
            </div>
        </div>
    );
}
