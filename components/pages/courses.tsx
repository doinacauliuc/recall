import { useEffect, useState } from "react";
import styles from "@/components/styles/pages.module.css";
import { useUser } from "@/app/hooks/userContext";


export type course = {
    course_name: string;
    course_id: number;
} | null;


export default function CoursesPage({ setActivePage }: { setActivePage: (page: string) => void }) {
    const { user } = useUser();
    const [courses, setCourses] = useState<course[]>([]);
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

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Notes</h1>
            {/* Input Field to Add Course */}
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Enter course title"
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
                        <div key={course?.course_id} className={styles.card}>
                            <h2>{course?.course_name}</h2>
                        </div>
                    ))
                ) : (
                    <p>No courses available</p>  // Custom message when there are no courses
                )}

            </div>
        </div>
    );
}
