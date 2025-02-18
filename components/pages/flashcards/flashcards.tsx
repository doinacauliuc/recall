import styles from '@/components/styles/pages.module.css'
import FlashcardSetsPage from './setList';
import FlashcardListPage from './flashcardList';
import { useState } from 'react';


//add flashcard sets, click on flashcard, show answer, click on menu to add flashcard
export default function FlashcardPage() {
    const [activePage, setActivePage] = useState<"setList" | "flashcards" >("setList"); // Default active page is "sets list"
    const [selectedSet, setSelectedSet] = useState<{ set_name: string; set_id: number } | null>(null); // Track the selected set

    const handleSetSelect = (set: { set_name: string; set_id: number }) => {
        setSelectedSet(set); // Set the selected course
        setActivePage("flashcards"); // Change the active page to "flashcards"
    };
    return (
            <div>
                {/* Conditional rendering for pages based on activePage state */}
                {activePage === "setList" && (
                    // Show Flashcard Sets Page when activePage is "setList"
                    <FlashcardSetsPage onSetSelect={handleSetSelect} />
                )}
    
                {activePage === "flashcards" && selectedSet && (
                    // Show NotesListPage when activePage is "notes" and a course is selected
                    <FlashcardListPage 
                        set={selectedSet} 
                        onBack={() => setActivePage("setList")} // Go back to courses page
                        //onNoteSelect={handleNoteSelect} // Handle note selection
                    />
                )}
    
            
            </div>
        );
}