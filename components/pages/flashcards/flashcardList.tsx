"use client";

import { useEffect, useState } from "react"; // Import React hooks for state management and side effects
import styles from "@/components/styles/flashcards.module.css"; // Import CSS styles for the component
import { Trash2, ThumbsUp, ThumbsDown  } from "lucide-react";


// Define the type for a flashcard
export type Flashcard = {
    flashcard_id: number; // Unique identifier for the flashcard
    question: string;
    answer: string;
    knowledge: number;
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

    const incKnowledge = async (flashcard_id: number) => {      
        // Set loading state to true and clear previous errors
        setLoading(true);
        

        try {
            // Send a PUT request to change the knowledge to the database
            const res = await fetch("/api/flashcards", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({option: "inc", flashcard_id: flashcard_id }),
            });

            console.log(res);
            // If the request fails, throw an error
            if (!res.ok) {
                throw new Error("Failed to increment knowledge.");
            }

            
            console.log("knowledge incremented") // Log successful note creation
        } catch (err) {
            console.error("Error incrementing knowledge:", err); // Log error to the console
            setError("Failed to increment knowledge."); // Display an error message
        } finally {
            setLoading(false); // Set loading to false after the operation is complete
        }
    };

    const decKnowledge = async (flashcard_id: number) => {      
        // Set loading state to true and clear previous errors
        setLoading(true);
        

        try {
            // Send a PUT request to change the knowledge to the database
            const res = await fetch("/api/flashcards", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({option: "dec", flashcard_id: flashcard_id }),
            });

            console.log(res);
            // If the request fails, throw an error
            if (!res.ok) {
                throw new Error("Failed to decrement knowledge.");
            }

            
            console.log("knowledge decremented") // Log successful decrement knowledge
        } catch (err) {
            console.error("Error decrementing knowledge:", err); // Log error to the console
            setError("Failed to decrement knowledge."); // Display an error message
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
                            <button className={styles.actionButton} /*onClick={() => deleteNote(note?.note_id)}*/>
                                <Trash2 /> 
                            </button>
                            </div>
                            {visibleAnswers[flashcard.flashcard_id] && (
                                <div className={styles.card}>
                                    <h2 className={styles.element}>{flashcard?.answer}</h2>
                                    <div className={styles.knowButtonContainer}>
                                        <button className={styles.actionButton} onClick={() => incKnowledge(flashcard?.flashcard_id)}>
                                            <ThumbsUp />
                                        </button>
                                        <button className={styles.actionButton} onClick={() => decKnowledge(flashcard?.flashcard_id)}>
                                            <ThumbsDown />
                                        </button>
                                    </div>
                                </div>

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
