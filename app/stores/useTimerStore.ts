
import { create } from 'zustand';

interface TimerState {
    workDuration: number;
    breakDuration: number;
    isRunning: boolean;
    isWorkSession: boolean;
    secondsLeft: number;

    setWorkDuration: (minutes: number) => void;
    setBreakDuration: (minutes: number) => void;
    setIsRunning: (running: boolean) => void;
    setIsWorkSession: (isWork: boolean) => void;
    setSecondsLeft: (seconds: number) => void;
    resetTimer: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
    workDuration: 25,
    breakDuration: 5,
    isRunning: false,
    isWorkSession: true,
    secondsLeft: 25 * 60,

    setWorkDuration: (minutes) => set({ workDuration: minutes }),
    setBreakDuration: (minutes) => set({ breakDuration: minutes }),
    setIsRunning: (running) => set({ isRunning: running }),
    setIsWorkSession: (isWork) => set({ isWorkSession: isWork }),
    setSecondsLeft: (seconds) => set({ secondsLeft: seconds }),
    resetTimer: () => {
        const { isWorkSession, workDuration, breakDuration } = get();
        const newSeconds = isWorkSession ? workDuration * 60 : breakDuration * 60;
        set({ isRunning: false, secondsLeft: newSeconds });
    }
}));
