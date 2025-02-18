"use client";

import { useEffect, useState } from "react"; // Import React hooks for state management and side effects
import styles from "@/components/styles/flashcards.module.css"; // Import CSS styles for the component
import { Trash2 } from "lucide-react";


// Define the type for a flashcard
export type Flashcard = {
    flashcard_id: number; // Unique identifier for the flashcard
    question: string;
    answer: string;
} | null; // Allow null 

// Define the props the NotesListPage component expects
interface FlashcardListProps {
    set: { set_name: string; set_id: number }; // Course data containing name and ID
    onBack: () => void; // Function to go back to the course selection page
}

// The component responsible for displaying the list of notes for a selected course
export default function FlashcardListPage({ set, onBack }: FlashcardListProps) {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]); // State to hold the list of flashcards
    const setID = set.set_id; // Extract the set ID for fetching flashcards
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({});


    const toggleAnswer = (id: string) => {
        setVisibleAnswers((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle visibility
        }));
    };


    // Function to fetch the notes for the selected course
    const fetchFlashcards = async () => {
        try {
            // Make API request to fetch flashcards associated with the set
            const response = await fetch(`/api/flashcards?set_id=${setID}`);
            const data = await response.json(); // Parse the response data
            setFlashcards(data); // Store the fetched notes in state
        } catch (error) {
            // If an error occurs, log it to the console
            console.error("Error fetching flashcards:", error);
        }
    };

    // Use useEffect to fetch flashcards whenever the set ID changes
    useEffect(() => {
        if (setID) fetchFlashcards(); // Fetch notes if set ID exists
    }, [setID]); // Re-run the effect when setID changes

       // Function to handle adding a new note
       const addFlashcard = async () => {
        // Validate if the question title is provided
        if (!question.trim()) {
            setError("Question cannot be empty."); // Show an error message if title is empty
            return;
        }
        if (!answer.trim()) {
            setError("Answer cannot be empty."); // Show an error message if title is empty
            return;
        }

        // Set loading state to true and clear previous errors
        setLoading(true);
        setError("");

        try {
            // Send a POST request to add the note to the database
            const res = await fetch("/api/flashcards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: question, answer: answer, set_id: setID }),
            });

            // If the request fails, throw an error
            if (!res.ok) {
                throw new Error("Failed to add flashcard.");
            }

            setAnswer(""); // Reset note title input after successful creation
            setQuestion(""); // Reset note content input
            fetchFlashcards();
            
            console.log("New flashcard created") // Log successful note creation
        } catch (err) {
            console.error("Error adding flashcard:", err); // Log error to the console
            setError("Failed to add flashcard."); // Display an error message
        } finally {
            setLoading(false); // Set loading to false after the operation is complete
        }
    };
    return (
        <div className={styles.pageContainer}>
            {/* Button to navigate back to the Courses page */}
            <button onClick={onBack} className={styles.button}>Back to Sets</button>

            {/* Display the selected course name */}
            <h1 className={styles.title}>{set.set_name.toUpperCase()}</h1>

            <div>
                <p> Add flashcard manually </p>

                    <div className={styles.inputContainer}>
                        <div className={styles.flashcardInputContainer}>
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className={styles.flashcardInput}
                                placeholder="Write the question..."
                            ></textarea>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className={styles.flashcardInput}
                                placeholder="Write the answer..."
                            ></textarea>
                        </div>
                        <button className={styles.button} onClick={addFlashcard}> Add to set </button>
                    </div>
            </div>

            {/* Container for displaying the list of notes */}
            <div className={styles.cardsContainer}>
                {flashcards?.length > 0 ? (
                    // If flashcards are available, map through them and display each note
                    flashcards.map((flashcard) => (
                        <div 
                        className={styles.flashcard}
                        key={flashcard?.flashcard_id} // Use ID as the unique key
                        >
                        <div className={styles.card}>
                            <h2 className={styles.element}
                            onClick={() => toggleAnswer(flashcard.flashcard_id)}
                            >{flashcard?.question}</h2> {/* Display question*/}
                            <Trash2 />
                        </div>
                        {visibleAnswers[flashcard.flashcard_id] && (
                            <h2 className={styles.element}>{flashcard?.answer}</h2>
                        )}
                        </div>
                        
                    ))
                ) : (
                    // If no flashcards are available, display a message
                    <p>No flashcards exist in this set</p>
                )}
            </div>
        </div>
    );
}
