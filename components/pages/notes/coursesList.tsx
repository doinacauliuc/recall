import { useEffect, useState } from "react";
import styles from "@/components/styles/pages.module.css";
import { useUser } from "@/app/hooks/userContext";
import { Trash2 } from 'lucide-react';


export type Course = {
    course_name: string;
    course_id: number;
} | null;

interface CoursesPageProps {
    onCourseSelect: (course: { course_name: string; course_id: number }) => void;
}


export default function CoursesPage({ onCourseSelect }: CoursesPageProps) {
    const { user } = useUser();
    const [courses, setCourses] = useState<Course[]>([]);
    const [newCourseTitle, setNewCourseTitle] = useState(""); // Store input value
    const [loading, setLoading] = useState(false);
    const userId = user?.id; // Replace with actual user ID from auth context or props
    const [error, setError] = useState("");


    // ✅ Define fetchCourses at the top level
    const fetchCourses = async () => {
        try {
            const response = await fetch(`/api/courses?userId=${userId}`);
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    // Fetch courses on mount or when userId changes
    useEffect(() => {
        if (userId) fetchCourses();
    }, [userId]);

    // Function to handle adding a new course
    const addCourse = async () => {
        if (!newCourseTitle.trim()) {
            setError("Course title cannot be empty.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ course_name: newCourseTitle, user_id: userId }),
            });

            if (!res.ok) {
                throw new Error("Failed to add course.");
            }

            const newCourse = await res.json();
            setCourses([...courses, newCourse]); // Update UI
            setNewCourseTitle(""); // Reset input
            await fetchCourses();
        } catch (err) {
            console.error("Error adding course:", err);
            setError("Failed to add course.");
        } finally {
            setLoading(false);
        }
    };

    const deleteCourse = async (courseId : number | undefined) => {
        try {
            const res = await fetch("/api/courses", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ course_id: courseId }), // Pass the courseId here
            });

            if (res.ok) {
                // If the request was successful, you can update the courses list or do other things
                fetchCourses();
            } else {
                alert("Only empty courses can be deleted. Please make sure there are no notes associated to the course before deleting.");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };


    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Courses</h1>
            {/* Input Field to Add Course */}
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Add new course"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className={styles.input}
                />
                <button onClick={addCourse} disabled={loading} className={styles.button}>
                    {loading ? "Adding..." : "Add Course"}
                </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.cardsContainer}>
                {courses?.length > 0 ? (
                    courses.map((course) => (
                        <div
                            key={course?.course_id}
                            className={styles.card}
                        >
                            <h2 className={styles.element} onClick={() => course && onCourseSelect(course)}>{course?.course_name}</h2>
                            <button onClick={() => deleteCourse(course?.course_id)}>
                                <Trash2 />
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No courses available</p>
                )}
            </div>
        </div>
    );
}
