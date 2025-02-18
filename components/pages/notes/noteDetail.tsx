import { useEffect, useState } from "react";
import styles from "@/components/styles/pages.module.css";

interface NoteDetailPageProps {
    note_id: number; // Ora passiamo solo l'ID della nota
    onBack: () => void;
}

export default function NoteDetailPage({ note_id, onBack }: NoteDetailPageProps) {
    const [note, setNote] = useState<{ note_title: string; content: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch della nota in base all'ID
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await fetch(`/api/notes?note_id=${note_id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch note");
                }
                const data = await response.json();
                setNote(data);
            } catch (err) {
                setError("Error loading note");
                console.error("Error fetching note:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [note_id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.pageContainer}>
            <button onClick={onBack} className={styles.button}>Back to Notes</button>
            {note ? (
                <>
                    <h1 className={styles.title}>{note.note_title}</h1>
                    <p className={styles.content}>{note.content}</p>
                </>
            ) : (
                <p>Note not found</p>
            )}
        </div>
    );
}
