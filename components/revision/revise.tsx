"use client";
import { useState } from "react"; // Importing React hook for managing state
import RevisionSetupPage from "@/components/revision/revisionSetup"; // Importing the revision setup page component

export default function RevisePage() {
    const [activePage, setActivePage] = useState<"setup" | "revision">("setup"); // Default active page is "setup"
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null); // Track the selected note ID

    // Function to handle when a note is selected
    const handleNoteSelect = (note_id: number) => {
        setSelectedNoteId(note_id); // Set the selected note ID
        console.log("Selected note ID:", note_id); // Log the selected note ID
        setActivePage("revision"); // Change the active page to "noteDetail"
    };

    return (
        <div>
            {activePage === "setup" && (
                            // Show CoursesPage when activePage is "courses"
                            <RevisionSetupPage onNoteSelect={handleNoteSelect} />
                        )}
          
            {activePage === "revision" && selectedNoteId !== null &&  (
                // Render the revision page
                <h1>Revision Page for Note ID: {selectedNoteId} </h1>
            )}
        </div>
    );
}


