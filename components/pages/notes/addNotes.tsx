import { useUser } from "@/app/hooks/userContext";
import styles from "@/components/styles/pages.module.css"
import { use, useEffect, useState } from "react";

export default function AddNotesPage() {
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [ error, setError] = useState("");
    const [ loading, setLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [courses, setCourses] = useState<{ course_id: number; course_name: string }[]>([]);
    const { user } = useUser();
    const userId = user?.id;


   // Function to handle adding a new course
   const addNote = async () => {
    if (!noteTitle.trim()) {
        setError("Course title cannot be empty.");
        return;
    }

    setLoading(true);
    setError("");

    try {
        const res = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ note_title: noteTitle, content: noteContent, course_id: selectedCourse }),
        });

        if (!res.ok) {
            throw new Error("Failed to add note.");
        }

        const newNote = await res.json();
        setNoteTitle(""); // Reset input
        setNoteContent("");
        console.log("New note created")
    } catch (err) {
        console.error("Error adding note:", err);
        setError("Failed to add note.");
    } finally {
        setLoading(false);
    }
};

    // Define fetchCourses at the top level
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

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Add Note</h1>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="New note title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className={styles.titleInput}
                />
                <select
                    value={selectedCourse ?? ""}
                    onChange={(e) => setSelectedCourse(Number(e.target.value))}
                    className={styles.input}
                >
                    <option value="" disabled className={styles.select}>Select course</option>
                    {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.course_name}
                        </option>
                    ))}
                </select>
                <button className={styles.button} onClick={addNote}> Add </button>
            </div>
            <div>
            <textarea className={styles.contentInput} 
            placeholder="Write content here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            ></textarea>

            </div>
        </div>
    );
}
