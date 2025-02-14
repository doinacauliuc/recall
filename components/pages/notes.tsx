import { useEffect, useState } from "react";
import styles from "@/components/styles/pages.module.css";

export type course = {
    title : string;
    id: number;
} | null;

export default function NotesPage() {
    const [courses, setCourses] = useState([]);
    const userId = "USER_ID_HERE"; // Replace with actual user ID from auth context or props

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await fetch(`/api/courses?userId=${userId}`);
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        }
        fetchCourses();
    }, [userId]);

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Notes</h1>
            <div className={styles.cardsContainer}>
                {courses.map((course) => (
                    <div key={course.id} className={styles.card}>
                            <h2>{course.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
