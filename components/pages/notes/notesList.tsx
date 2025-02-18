import { useEffect, useState } from "react";
import styles from "@/components/styles/pages.module.css"

export type Note = {
    note_id: number;
    note_title: string;
    note_content: string;
} | null;

interface NotesListPageProps {
    course: { course_name: string; course_id: number };
    onNoteSelect: (note_id: number) => void; // Passiamo solo l'ID
    onBack: () => void;
}


export default function NotesListPage({ course, onBack, onNoteSelect }: NotesListPageProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const courseID = course.course_id;

    const fetchNotes = async () => {
        try {
            const response = await fetch(`/api/notes?course_id=${courseID}`);
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    useEffect(() => {
        if (courseID) fetchNotes();
    }, [courseID]);

    return (
        <div className={styles.pageContainer}>
            <button onClick={onBack} className={styles.button}>Back to Courses</button>
            <h1 className={styles.title}>{course.course_name.toUpperCase()}</h1>

            <div className={styles.cardsContainer}>
                {notes?.length > 0 ? (
                    notes.map((note) => (
                        <div 
                            key={note?.note_id} 
                            className={styles.card} 
                            onClick={() => note && onNoteSelect(note.note_id)}
                        >
                            <h2 className={styles.element}>{note?.note_title}</h2>
                        </div>
                    ))
                ) : (
                    <p>No notes available for this course</p>
                )}
            </div>
        </div>
    );
}
