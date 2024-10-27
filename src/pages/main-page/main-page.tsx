import React, { useState, useEffect } from "react";
import { TaskItem } from "../../components/task-item/task-item";
import { generateId } from "../../helper-functions/helper-functions";
import './main-page-styles.scss';

const saveTasksToLocalStorage = (tasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = (): Task[] => {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
};

const loadThemeFromLocalStorage = () => {
    return localStorage.getItem("theme") || "system";
};

export function MainPage() {
    const [tasks, setTasks] = useState<Task[]>(loadTasksFromLocalStorage());
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [theme, setTheme] = useState(loadThemeFromLocalStorage());

    useEffect(() => {
        saveTasksToLocalStorage(tasks);
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.className = theme;
    }, [theme]);

    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(tasks.map((task) => task.id === updatedTask.id ? updatedTask : task));
    };

    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const handleAddTask = () => {
        const newTask: Task = {
            id: generateId(),
            title: "New Task",
            description: "",
            subtasks: [],
            completed: false,
            expanded: false,
        };
        setTasks([...tasks, newTask]);
    };

    const handleTaskSelect = (task: Task) => {
        setSelectedTask(task);
    };

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
    };

    return (
        <>
            <div className="theme-switcher">
                <button onClick={() => handleThemeChange("light")}>Светлая тема</button>
                <button onClick={() => handleThemeChange("dark")}>Темная тема</button>
            </div>
            <div className="main-page">
                <div className="task-list">
                    <h1>Список задач</h1>
                    {tasks.length === 0 && (
                        <h3>Добавьте первую задачу!</h3>
                    )}
                    {tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onUpdate={handleUpdateTask}
                            onDelete={handleDeleteTask}
                            onSelect={handleTaskSelect}
                        />
                    ))}
                    <button className="add-task-button" onClick={handleAddTask}>Добавить задачу</button>
                </div>
                <div className="task-details">
                    {selectedTask && (
                        <>
                            <h2>{selectedTask.title}</h2>
                            <p>{selectedTask.description}</p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
