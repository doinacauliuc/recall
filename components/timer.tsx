//Timer component for a Pomodoro timer 

import styles from '@/components/styles/timer.module.css';
import { CirclePlay, CirclePause, CircleStop } from 'lucide-react'; // Importing icons from lucide-react


//Timer paramenters are passed from the timerContext
import { useTimer } from '@/app/hooks/timerContext';


export default function Timer() {
    const {
        workDuration,
        breakDuration,
        isRunning,
        isWorkSession,
        secondsLeft,
        setWorkDuration,
        setBreakDuration,
        handleStart,
        handlePause,
        handleReset
    } = useTimer(); // Accessing timer context

    // Function to format time in MM:SS format
   const formatTime = (totalSeconds: number) => {
        // Calculate minutes and seconds from total seconds
        //Divide the total seconds by 60 to get minutes and use modulo operator to get the remaining seconds
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
            // Pad the minutes and seconds with leading zeros if they are less than 10
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
                <button className={styles.button} onClick={handleStart}><CirclePlay /></button>
                <button className={styles.button} onClick={handlePause}><CirclePause /></button>
                <button className={styles.button} onClick={handleReset}><CircleStop /></button>
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