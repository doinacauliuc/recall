import styles from '@/components/styles/timer.module.css';
import React, { useState, useEffect, useRef } from 'react';
import { CirclePlay, CirclePause, CircleStop } from 'lucide-react'; // Importing icons from lucide-react

interface TimerProps {
    workDuration: number; // Duration of the work session in minutes
    breakDuration: number; // Duration of the break session in minutes
    isRunning: boolean; // Flag to indicate if the timer is running
    isWorkSession: boolean; // Flag to indicate if it's a work session
    secondsLeft: number; // Seconds left in the current session
    setWorkDuration: (minutes: number) => void; // Function to set work duration
    setBreakDuration: (minutes: number) => void; // Function to set break duration
    onStart: () => void; // Function to start the timer
    onPause: () => void; // Function to pause the timer
    onReset: () => void; // Function to reset the timer
}

export default function Timer({workDuration, breakDuration, isRunning, isWorkSession, secondsLeft, setWorkDuration, setBreakDuration, onStart, onPause, onReset}: TimerProps) {
   const formatTime = (totalSeconds: number) => {
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          return `${minutes.toString().padStart(2, '0')}:${seconds
              .toString()
              .padStart(2, '0')}`;
      };
      
    return (
        <div className={styles.timerContainer}>
            <h2 className={styles.title}>{isWorkSession ? 'Study Session' : 'Break Time'}</h2>
            <div className={styles.timer}>
                {formatTime(secondsLeft)}
            </div>
            <div className={styles.controlsContainer}>
                <button className={styles.button} onClick={onStart}><CirclePlay /></button>
                <button className={styles.button} onClick={onPause}><CirclePause /></button>
                <button className={styles.button} onClick={onReset}><CircleStop /></button>
            </div>
            <div className={styles.durationContainer}>
                <label className={styles.label}>
                    Work Duration:
                    <select
                        className={styles.select}
                        value={workDuration}
                        onChange={(e) => setWorkDuration(parseInt(e.target.value))}
                        disabled={isRunning}
                    >
                        {[1, 15, 20, 25, 30, 45, 60].map((min) => (
                            <option key={min} value={min}>{min} min</option>
                        ))}
                    </select>
                </label>
                <label className={styles.label}>
                    Break Duration:
                    <select
                        className={styles.select}
                        value={breakDuration}
                        onChange={(e) => setBreakDuration(parseInt(e.target.value))}
                        disabled={isRunning}
                    >
                        {[1,3, 5, 10, 15, 20].map((min) => (
                            <option key={min} value={min}>{min} min</option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}