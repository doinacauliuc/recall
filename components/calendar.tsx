import { useState, useEffect } from "react";
import styles from "@/components/styles/calendar.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Importing icons from lucide-react

interface CalendarProps {
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void; // Function to update the selected date
}

export default function Calendar({ selectedDate, setSelectedDate }: CalendarProps) {
    const [days, setDays] = useState<string[]>([]); // State to manage the list of days
    const [currentDate, setCurrentDate] = useState(new Date());
    const daysInMonth = getDaysInMonth(currentDate);
    //const [selectedDate, setSelectedDate] = useState(new Date());
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const nextMonth = () => {
        const nextDate = new Date(currentDate);
        nextDate.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(nextDate);
    }

    const prevMonth = () => {
        const prevDate = new Date(currentDate);
        prevDate.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(prevDate);
    }




    function getDaysInMonth(date: Date) {
        const year = date.getFullYear();
        const month = date.getMonth();

        // Get number of days in the month
        const numDays = new Date(year, month + 1, 0).getDate();

        // Get day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
        const firstDay = new Date(year, month, 1).getDay();

        // Adjust to make Monday = 0
        const adjustedStart = firstDay === 0 ? 6 : firstDay - 1;

        const daysArray = Array(adjustedStart).fill(null).concat(
            Array.from({ length: numDays }, (_, i) => i + 1)
        );

        return daysArray;
    }

    const handleDateClick = (day: number) => {
        // Set the selected date by updating the day, maintaining the month and year
        const newDate = new Date(currentDate);
        newDate.setDate(day);
        setSelectedDate(newDate); // Update the selected date in the parent component
    };


    // Update the days of the week and month/year when the current date changes
    // This effect runs when the component mounts and whenever currentDate changes
    useEffect(() => {
        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        setDays(weekdays);

        setMonth(currentDate.toLocaleString('default', { month: 'long' }));
        setYear(currentDate.getFullYear().toString());
    }, [currentDate]);

    // Update the current date when the selected date changes
    useEffect(() => {
        if (selectedDate) {
            setCurrentDate(selectedDate);
        }
    }, [selectedDate]);

    return (
        <div className={styles.calendar}>
            <div className={styles.controlsContainer}>
                <ChevronLeft className={styles.chevron} onClick={prevMonth} />
                <h3 className={styles.month}>{month}, {year}</h3>
                <ChevronRight className={styles.chevron} onClick={nextMonth} />
            </div>
            <div className={styles.weekdaysHeader}>
                {days.map((day, index) => (
                    <div key={index} className={styles.weekday}>
                        {day}
                    </div>
                ))}
            </div>
            <div className={styles.datesGrid}>
                {daysInMonth.map((day, index) => (
                    <div key={index}
                        className={`${styles.dateCell} ${selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear() ? styles.selectedDateCell : ''}`}
                        onClick={() => handleDateClick(day)}>
                        {day !== null ? day : ""}
                    </div>
                ))}
            </div>
        </div>

    );
}