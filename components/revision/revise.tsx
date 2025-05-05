"use client";
import { useState } from "react"; // Importing React hook for managing state
import RevisionSetupPage from "@/components/revision/revisionSetup"; // Importing the revision setup page component
import RevisionChatPage from "@/components/revision/revisionChat"; // Importing the revision chat page component
import type { Note } from "@/components/revision/revisionSetup"; // Importing the Note type for TypeScript

export default function RevisePage() {
    const [activePage, setActivePage] = useState<"setup" | "revision">("setup"); // Default active page is "setup"
    const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined); // Track the selected note 
    
    // Function to handle when a note is selected
    const handleNoteSelect = (note: Note | undefined ) => {
        setSelectedNote(note); // Set the selected note ID
    
        console.log("Selected note ID:", note); // Log the selected note ID
        setActivePage("revision"); // Change the active page to "noteDetail"
    };

    return (
        <div>
            {activePage === "setup" && (
                            // Show CoursesPage when activePage is "courses"
                            <RevisionSetupPage onNoteSelect={handleNoteSelect} />
                        )}
          
            {activePage === "revision" && selectedNote !== undefined  && (
                // Render the revision page
                <RevisionChatPage note={selectedNote} />
            )}
        </div>
    );
}


