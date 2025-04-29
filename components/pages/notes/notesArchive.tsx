"use client";

import { useState } from "react"; // Importing React hook for managing state
import CoursesPage from "./coursesList"; // Import the CoursesPage component
import NotesListPage from "./notesList"; // Import the NotesListPage component
import NoteDetailPage from "./noteDetail"; // Import the NoteDetailPage component

export default function NoteBrowsingPage() {
    // Define state variables to manage the active page and selected course/note

    const [activePage, setActivePage] = useState<"courses" | "notes" | "noteDetail">("courses"); // Default active page is "courses"
    const [selectedCourse, setSelectedCourse] = useState<{ course_name: string; course_id: number } | null>(null); // Track the selected course
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null); // Track the selected note ID

    // Function to handle when a course is selected
    const handleCourseSelect = (course: { course_name: string; course_id: number }) => {
        setSelectedCourse(course); // Set the selected course
        setActivePage("notes"); // Change the active page to "notes"
    };

    // Function to handle when a note is selected
    const handleNoteSelect = (note_id: number) => {
        setSelectedNoteId(note_id); // Set the selected note ID
        setActivePage("noteDetail"); // Change the active page to "noteDetail"
    };

    return (
        <div>
            {/* Conditional rendering for pages based on activePage state */}
            {activePage === "courses" && (
                // Show CoursesPage when activePage is "courses"
                <CoursesPage onCourseSelect={handleCourseSelect} />
            )}

            {activePage === "notes" && selectedCourse && (
                // Show NotesListPage when activePage is "notes" and a course is selected
                <NotesListPage 
                    course={selectedCourse} 
                    onBack={() => setActivePage("courses")} // Go back to courses page
                    onNoteSelect={handleNoteSelect} // Handle note selection
                />
            )}

            {activePage === "noteDetail" && selectedNoteId !== null && (
                // Show NoteDetailPage when activePage is "noteDetail" and a note is selected
                <NoteDetailPage 
                    note_id={selectedNoteId} 
                    onBack={() => setActivePage("notes")} // Go back to notes page
                />
            )}
        </div>
    );
}
