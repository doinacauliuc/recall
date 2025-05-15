'use client';

// Context and state management for a timer application, to keep state persistent across components

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useUser } from "./userContext"; // Importing user context

type TimerContextType = {
  workDuration: number;
  breakDuration: number;
  isRunning: boolean;
  isWorkSession: boolean;
  secondsLeft: number;
  handleStart: () => void;
  handlePause: () => void;
  handleReset: () => void;
  setWorkDuration: React.Dispatch<React.SetStateAction<number>>;
  setBreakDuration: React.Dispatch<React.SetStateAction<number>>;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const { user } = useUser(); // Accessing user context
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(workDuration * 60);


  // Ref to store the timer ID
  // This is used to clear the timer when the component unmounts or when the timer is reset
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to track if the session has just been logged
  // This prevents multiple logs for the same session
  const sessionJustLoggedRef = useRef(false);

  // Sync duration if timer isn't running
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(isWorkSession ? workDuration * 60 : breakDuration * 60);
    }
  }, [workDuration, breakDuration]);

  const loadSessionData = async (duration: number) => {
    const res = await fetch("/api/study-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id, // Replace or pass in context
        duration,
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to load session data");
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      // Decrease the seconds left by 1 every second
      // If seconds left is 0, switch to the next session
      // If it's a work session, log the session data
      // If it's a break session, just switch to the next session
  
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          //Chenge the session type
          // If a session type is work, switch to break and vice versa
          const nextIsWork = !isWorkSession;
          // Calculate the next duration based on the session type
          const nextDuration = nextIsWork ? workDuration * 60 : breakDuration * 60;

          if (isWorkSession && !sessionJustLoggedRef.current) {
            loadSessionData(workDuration);
            sessionJustLoggedRef.current = true;
          }

          if (nextIsWork) {
            // If switching to work session, reset the session just logged flag
            sessionJustLoggedRef.current = false;
          }

          // Switch to the next session
          setIsWorkSession(nextIsWork);
          return nextDuration;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [isRunning, isWorkSession, workDuration, breakDuration]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(isWorkSession ? workDuration * 60 : breakDuration * 60);
  };

  return (
    <TimerContext.Provider
      value={{
        workDuration,
        breakDuration,
        isRunning,
        isWorkSession,
        secondsLeft,
        handleStart,
        handlePause,
        handleReset,
        setWorkDuration,
        setBreakDuration,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within a TimerProvider");
  return context;
};
