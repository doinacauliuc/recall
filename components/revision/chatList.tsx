'use client'

import styles from "@/components/styles/pages.module.css"; // Importing CSS styles
import { use, useEffect, useState } from "react"; // Importing React hooks
import { Trash2 } from "lucide-react";

interface ChatListPageProps {
    user_id: Number | undefined; // User ID from the user context
    onChatSelect: (chat: Chat |undefined) => void; // Function to handle chat selection
    onBack: () => void; // Function to go back to the setup page
}

export type Chat = {
    chat_id: number;
    user_id: number;
    chat_title: string;
    last_opened: Date;
    note_id: number;
}


export default function ChatListPage({ user_id, onChatSelect, onBack }: ChatListPageProps) {
    const [chatList, setChatList] = useState<Chat[]>([]); // State to store chat list
    // Fetch the courses related to the user from the API
    const fetchChats = async () => {
        try {
            // Fetch courses from the server using the userId as query parameter
            const response = await fetch(`/api/chat-db?user_id=${user_id}`);
            const data = await response.json(); // Parse the response data
            setChatList(data); // Update the courses state with fetched data
        } catch (error) {
            console.error("Error fetching courses:", error); // Log error if fetching fails
        }
    };

    useEffect(() => {
        if (user_id) fetchChats(); // Only fetch if userId is available (user is logged in)
    }, [user_id]);

    return (
        <div className={styles.pageContainer}>
            <button className={styles.button} onClick={onBack}> Back to Setup </button> {/* Button to go back to setup page */}
            <h1 className={styles.title}>Previous Chats</h1> {/* Title for the page */}


            {/* Display chatlist */}
            <div className={styles.cardsContainer}>
                {chatList?.length > 0 ? (
                    chatList.map((chat) => (
                        <div
                            key={chat?.chat_id} // Unique key for each course card
                            className={styles.card}
                        >
                            <h2 className={styles.element} onClick={() => chat.chat_id && onChatSelect(chat)}> {chat?.chat_title}</h2>
                        </div>
                    ))
                ) : (
                    <p>No previous chats available</p> // Message when there are no chats
                )}
            </div>
        </div>
    );
}