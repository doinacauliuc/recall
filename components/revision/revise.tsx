"use client";
import { useState } from "react"; // Importing React hook for managing state
import RevisionSetupPage from "@/components/revision/revisionSetup"; // Importing the revision setup page component
import RevisionChatPage from "@/components/revision/revisionChat"; // Importing the revision chat page component
import type { Note } from "@/components/revision/revisionSetup"; // Importing the Note type for TypeScript
import { useUser } from "@/app/hooks/userContext"; // Importing user context for managing user state
import ChatListPage from "@/components/revision/chatList"; // Importing the chat list page component
import ResumedChatPage from "@/components/revision/resumedChat"; // Importing the resumed chat page component

export default function RevisePage() {
    const [activePage, setActivePage] = useState<"setup" | "chat" | "newchat" | "chatlist">("setup"); // Default active page is "setup"
    const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined); // Track the selected note 
    const [selectedChat, setSelectedChat] = useState<number | undefined>(undefined); // Track the selected chat
    const { user } = useUser(); // Get the user context
    
    // Function to handle when a note is selected
    const handleNoteSelect = (note: Note | undefined ) => {
        setSelectedNote(note); // Set the selected note ID
    
        console.log("Selected note ID:", note); // Log the selected note ID
        setActivePage("newchat"); // Change the active page to "noteDetail"
    };

    const handleResumeSelect = () => {
        setActivePage("chatlist"); // Change the active page to "chatlist"
    }

    const handleExit = () => {
        setActivePage("setup"); // Change the active page to "setup"
        setSelectedNote(undefined); // Reset the selected note
    }

    const handleResumeChat = (chat_id: number | undefined) => {
        setSelectedChat(chat_id); // Set the selected chat ID
        console.log("Selected chat ID:", chat_id); // Log the selected chat ID
        setActivePage("chat"); 
    }
    return (
        <div>
            {activePage === "setup" && (
                            // Render the revision setup page
                            <RevisionSetupPage onNoteSelect={handleNoteSelect} onResumeSelect={handleResumeSelect} />
                        )}
          
            {activePage === "newchat" && selectedNote !== undefined  && (
                // Render the revision page -> new chat
                <RevisionChatPage note={selectedNote} onExit={handleExit} user_id={user?.id}/>
            )}
            {activePage === "chatlist" && (
                // Show CoursesPage when activePage is "courses"
                <ChatListPage user_id={user?.id} onChatSelect={handleResumeChat}/>
            )}
            {activePage === "chat" && selectedChat !== undefined  &&(
                // Render the revision page -> resumed chat
                <ResumedChatPage chat_id={selectedChat} onExit={handleExit}/>
            )}
        </div>
    );
}


