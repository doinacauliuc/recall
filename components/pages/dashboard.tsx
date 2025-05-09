import styles from '@/components/styles/dashboard.module.css'
import { useUser } from '@/app/hooks/userContext';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Circle, CircleCheck, Trash2 } from 'lucide-react'; // Importing icons from lucide-react
import Calendar from '../calendar';

//define the type of task
export type Task = {
    task_id: number; // Unique identifier for the task
    task_title: string; // Title of the task
    completed: boolean; // Status of the task (completed or not)
    date: Date; // Date when the task was created
    user_id: number; // ID of the user who created the task
}

export default function Dashboard() {
    //to do list data
    const [tasks, setTasks] = useState<Task[]>([]); // State to manage the list of tasks
    const [newTaskTitle, setNewTaskTitle] = useState<string>(''); // State to manage the new task input
    const { user } = useUser(); // Accessing user context
    const userId = user?.id; // Getting the user ID from the context
    const [date, setDate] = useState<Date>(new Date()); // State to manage the date



    useEffect(() => {
        if (userId) {  // Checking if user ID is available
            fetchTasks(); // Fetching tasks when the component mounts or user ID changes
        }
    }, [userId,date]); // Dependencies for useEffect


    //to do list functions
    const fetchTasks = async () => {
        try {
            const response = await fetch(`/api/tasks?userId=${userId}&date=${date.toISOString()}`); // Fetching tasks from the API
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json(); // Parsing the response data
            setTasks(data); // Updating the tasks state with the fetched data
        }
        catch (error) {
            console.error('Error fetching tasks:', error); // Logging any errors
        }
    }

    const increaseDate = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1); // Incrementing the date by one day
        setDate(newDate); // Updating the date state
    }

    const decreaseDate = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1); // Decrementing the date by one day
        setDate(newDate); // Updating the date state
    }

    const addTask = async () => {
        if (!newTaskTitle) return; // Prevent adding empty tasks
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task_title: newTaskTitle,
                    completed: false,
                    date: date.toISOString(),
                    user_id: userId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            const newTask = await response.json(); // Parsing the newly created task
            setTasks([...tasks, newTask]); // Updating the tasks state with the new task
            setNewTaskTitle(''); // Resetting the input field
        } catch (error) {
            console.error('Error adding task:', error); // Logging any errors
        }
    }
    const deleteTask = async (taskId: number) => {
        try {
            const response = await fetch(`/api/tasks?taskId=${taskId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            setTasks(tasks.filter(task => task.task_id !== taskId)); // Updating the tasks state by removing the deleted task
        } catch (error) {
            console.error('Error deleting task:', error); // Logging any errors
        }
    }

    const toggleTaskCompletion = async (taskId: number) => {
        try {
            const task = tasks.find(task => task.task_id === taskId);
            if (!task) return; // Prevent toggling if task not found
            const completionStatus = !task.completed;
            const response = await fetch(`/api/tasks/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task_id: taskId, completed: completionStatus }), // Sending the updated task to the API
            });
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            const data = await response.json(); // Parsing the updated task
            setTasks(tasks.map(task => (task.task_id === taskId ? data : task))); // Updating the tasks state with the updated task
        } catch (error) {
            console.error('Error updating task:', error); // Logging any errors
        }
    }


    return (
        <div className={styles.dashboard}>
            <div className={styles.managementContainert}>
                <div className={styles.calendarContainer}>
                    <Calendar selectedDate={date} setSelectedDate={(date) => setDate(date || new Date())} />
                </div>
                <div className={styles.headerContainer}>
                    <button className={styles.directionButton} onClick={decreaseDate}><ChevronLeft /> </button>
                    <h1 className={styles.taskDate}>{date.toDateString()}</h1> {/* Title for the page */}
                    <button className={styles.directionButton} onClick={increaseDate}><ChevronRight /> </button>
                </div>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        value={newTaskTitle} // Controlled input for the new task
                        onChange={(e) => setNewTaskTitle(e.target.value)} // Update new task title state on input change
                        placeholder="Add your tasks for the day..."
                        className={styles.taskInput} // CSS class for styling the input field
                    />
                    <button
                        onClick={addTask} // Call addTask function on button click
                        className={styles.directionButton} // CSS class for styling the add button
                    >
                        <Plus /> {/* Icon for the add button */}
                    </button>
                </div>
                <div className={styles.cardContainer}>
                    {tasks.map((task) => (
                        <div key={task.task_id} className={styles.taskContainer}>
                            <div className={styles.task}>
                                <button className={styles.check} onClick={() => toggleTaskCompletion(task.task_id)}>
                                    {/* Toggle task completion status */}
                                    {/* Display a check icon if the task is completed, otherwise display a circle */}
                                    {task.completed ? <CircleCheck /> : <Circle />} {/* Icon based on task completion status */}
                                </button>
                                <span className={styles.taskTitle}>{task.task_title}</span> {/* Task title */}
                            </div>
                            <button className={styles.check} onClick={() => deleteTask(task.task_id)}> <Trash2 /></button>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.infoCard}></div>
                <div className={styles.infoCard}></div>
            </div>
                    </div>

    );

}