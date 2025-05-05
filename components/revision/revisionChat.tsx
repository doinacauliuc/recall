

'use client';


import { useEffect, useState, useRef } from 'react';
import styles from '@/components/styles/revisionChat.module.css';
import { send } from 'process';
import { Note } from '@/components/revision/revisionSetup';

interface RevisionChatPageProps {
    note: Note;
}

interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export default function RevisionChatPage({ note }: RevisionChatPageProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>(''); // State to manage input value
    const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref to manage the textarea element
    const chatContainerRef = useRef<HTMLDivElement>(null); // Ref to manage the chat container element
    const [isLoading, setIsLoading] = useState(false); // State to manage loading status


    useEffect(() => {
        // On mount, add the first bot message
        let initialText: string = `Hello! I am here to help you with your revision. I will be asking you questions about ${note.note_title} and will assess your answers. Are you ready to start?`;

        const initialMessage: Message = {
            role: 'model',
            parts: [{ text: initialText }]
        };

        setMessages([initialMessage]);
        textareaRef.current?.focus(); // Focus on the textarea when the component mounts
    }, [note]);

    // Scroll to the bottom of the chat container when new messages are added
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

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
                body: JSON.stringify({ history: updatedMessages, note_id: note.note_id }),
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
};
