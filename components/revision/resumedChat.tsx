'use client';
import { useEffect, useState, useRef, use } from 'react';
import styles from '@/components/styles/revisionChat.module.css';
import { type Chat } from '@/components/revision/chatList';


interface ResumedChatPageProps {
    chat: Chat | undefined; // Chat ID from the user context
    onExit: () => void; // Function to handle going back to the previous page
}

interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export default function ResumedChatPage({ chat, onExit }: ResumedChatPageProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>(''); // State to manage input value
    const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref to manage the textarea element
    const chatContainerRef = useRef<HTMLDivElement>(null); // Ref to manage the chat container element
    

    const fetchMessages = async () => {
        if (!chat) return; // If chat is not available, return early
        console.log("Fetching messages for chat ID:", chat.chat_id); // Log the chat ID being fetched
        try {
            // Fetch the chat from the server using the chat ID
            const response = await fetch(`/api/chat-db?chat_id=${chat.chat_id}`);
            const data = await response.json();
            console.log("Fetched messages:", data.messages); // Log the fetched messages
            setMessages(data.messages); // Update the messages state with the fetched data
            
            if (!response.ok) {
                throw new Error('Failed to fetch chat');
            }
        }
        catch (error) {
            console.error("Error fetching chat:", error); // Log error if fetching chat fails
        }
    }

    useEffect(() => {
        if (chat?.chat_id) fetchMessages(); // Only fetch if chat_id is available
        console.log("Chat ID page resumed:", chat?.chat_id); // Log the chat ID
    }, [chat?.chat_id]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const SaveAndExit = async () => {
        // Send a PUR request to add the chat to the database
        const res = await fetch("/api/chat-db", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chat?.chat_id, messages: messages }),
        });

        // If the request fails, throw an error
        if (!res.ok) {
            throw new Error("Failed to svae chat.");
        }
        onExit();
    }

    const handleSendMessage = async (text: string) => {
        if (text.trim() === '') return;

        const newUserMessage: Message = {
            role: 'user',
            parts: [{ text }],
        };

        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setInputValue('');


        try {

            const res = await fetch('/api/gemini-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: updatedMessages, note_id: chat?.note_id }),
            });

            const data = await res.json();

            const newBotMessage: Message = {
                role: 'model',
                parts: [{ text: data.reply }],
            };

            setMessages([...updatedMessages, newBotMessage]);
        } catch (err) {
            console.error(err);
            setMessages([
                ...updatedMessages,
                {
                    role: 'model',
                    parts: [{ text: 'Something went wrong.' }],
                },
            ]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // prevent newline
            handleSendMessage(inputValue); // Send the message
        }
    };

    return (
        <div className={styles.pageContainer}>
            <button className={styles.button}
                onClick={SaveAndExit}>Exit chat</button>
            <div className={styles.chatWrapper}>
                {/* Chat  area */}
                <div className={styles.chatContainer}>
                    <div ref={chatContainerRef} className={styles.chatContainer}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={msg.role === 'model' ? styles.botMessage : styles.userMessage}
                            >
                                {msg.parts[0].text}
                            </div>
                        ))}
                    </div>
                </div>


                {/* Input area */}
                <div className={styles.inputContainer}>
                    <textarea
                        ref={textareaRef}
                        className={styles.input}
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            if (textareaRef.current) {
                                textareaRef.current.style.height = 'auto';
                                textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
                            }
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className={styles.sendButton}
                        onClick={() => {
                            handleSendMessage(inputValue);
                            if (textareaRef.current) {
                                textareaRef.current.style.height = 'auto';
                            }
                        }}> Send </button>
                </div>
            </div>
        </div>
    );
}
