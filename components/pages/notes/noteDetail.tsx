"use client";

import { useEffect, useState, useRef } from "react"; // React hooks for managing state and lifecycle
import styles from "@/components/styles/pages.module.css"; // Import custom CSS module for styling
import { BookText, WalletCards } from 'lucide-react';
import LoadingPage from "@/components/loadingPage";
import { useUser } from "@/app/hooks/userContext";
import DOMPurify from 'dompurify';
import Quill from "quill"; // Import Quill
import 'quill/dist/quill.bubble.css'; // Import Quill's snow theme CSS

// Define the types for the props the component expects
interface NoteDetailPageProps {
    note_id: number; // ID of the note to display
    onBack: () => void; // Function to handle navigating back to the previous page
}

export default function NoteDetailPage({ note_id, onBack }: NoteDetailPageProps) {
    const [note, setNote] = useState<{ note_title: string; content: string; course_id: number } | null>(null); // State to store the note data
    const [loading, setLoading] = useState(true); // Loading state to manage the UI while data is being fetched
    const [error, setError] = useState(""); // Error state to display error messages if something goes wrong
    const { user } = useUser();
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
                      ['bold', 'italic', 'underline'], // Basic styling options
                      [{ 'list': 'bullet' }, { 'list': 'ordered' }], // Bullet and numbered lists
                      [{ 'size': ['small', 'medium', 'large', 'huge'] }] // Font size options
                    ],
                  },
                readOnly: true,
            });

            // Set the Quill instance to the state
            setQuillInstance(quill);

            // Set the note content into Quill once it's initialized
            if (note?.content) {
                quill.root.innerHTML = note.content;
            }
        }
    }, [note]); // Empty dependency array ensures it only runs once

    

    // Fetch the note based on the note_id passed via props
    useEffect(() => {
        // Async function to fetch the note data from the API
        const fetchNote = async () => {
            try {
                // Make a request to fetch the note details using the note_id
                const response = await fetch(`/api/notes?note_id=${note_id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch note"); // If the request fails, throw an error
                }
                const data = await response.json(); // Parse the response into JSON
                setNote(data); // Set the note data into the state
            } catch (err) {
                setError("Error loading note"); // If there is an error, set the error message
                console.error("Error fetching note:", err); // Log the error to the console
            } finally {
                setLoading(false); // Set loading to false once the fetching is done (successful or not)
            }
        };

        fetchNote(); // Call the fetchNote function to get the data
    }, [note_id]); // Effect runs when the note_id prop changes

    // Return loading state while waiting for the API response
    if (loading) return <LoadingPage />;

    // Return error state if there is an issue fetching the note
    if (error) return <p className={styles.error}>{error}</p>;

    const createSummary = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    note_title: note?.note_title, 
                    content: note?.content, 
                    course_id: note?.course_id 
                }),
            });
    
            if (!res.ok) {
                throw new Error(`Failed to fetch summary: ${res.statusText}`);
            }
            else {
                alert("Summary has been added to course notes");
            }
    
            const data = await res.json();
            setLoading(false);

        } catch (error) {
            console.error("Error creating summary:", error);
            return null; // Return null in case of an error
        }
    };

    const createFlashcards = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/create_flashcards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    note_title: note?.note_title, 
                    content: note?.content,
                    user_id: user?.id
                }),
            });
    
            if (!res.ok) {
                throw new Error(`Failed to create flashcards: ${res.statusText}`);
            }
            else {
                alert("Flashcard set has been created succesfully");
            }
    
            const data = await res.json();
            setLoading(false);

        } catch (error) {
            console.error("Error creating flashcards:", error);
            return null; // Return null in case of an error
        }
    };
    
    
    return (
        <div className={styles.pageContainer}>
            {/* Back button to return to the previous page */}
            <div className={styles.buttonContainer}>
            <button onClick={onBack} className={styles.button}>Back to Notes</button>
            <div className={styles.optionsContainer}>
                <button className={styles.button} onClick={createSummary}> Create Summary</button>
                <button className={styles.button} onClick={createFlashcards}> Create Flashcards</button>
            </div>

            </div>
            

            {/* Render the note details if the note exists */}
            {note ? (
                <>
                <h1 className={styles.title}>{note.note_title}</h1>
                <div 
                    ref={quillRef} 
                    style={{
                        height: 'auto',
                        width: '950px',
                    }}
                    className={styles.contentInput}
                /> {/* Quill editor container */}
            </>
            ) : (
                // If the note is not found, show this message
                <p>Note not found</p>
            )}
            
        </div>
    );
}
