import { useState } from "react";
import CoursesPage from "./coursesList";
import NotesListPage from "./noteslist";
import NoteDetailPage from "./notedetail";

export default function NoteBrowsingPage() {
    const [activePage, setActivePage] = useState<"courses" | "notes" | "noteDetail">("courses");
    const [selectedCourse, setSelectedCourse] = useState<{ course_name: string; course_id: number } | null>(null);
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

    const handleCourseSelect = (course: { course_name: string; course_id: number }) => {
        setSelectedCourse(course);
        setActivePage("notes");
    };

    const handleNoteSelect = (note_id: number) => {
        setSelectedNoteId(note_id);
        setActivePage("noteDetail");
    };

    return (
        <div>
            {activePage === "courses" && <CoursesPage onCourseSelect={handleCourseSelect} />}
            {activePage === "notes" && selectedCourse && (
                <NotesListPage course={selectedCourse} onBack={() => setActivePage("courses")} onNoteSelect={handleNoteSelect} />
            )}
            {activePage === "noteDetail" && selectedNoteId !== null && (
                <NoteDetailPage note_id={selectedNoteId} onBack={() => setActivePage("notes")} />
            )}
        </div>
    );
}
