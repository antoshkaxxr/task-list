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

export function MainPage() {
    const [tasks, setTasks] = useState<Task[]>(loadTasksFromLocalStorage());
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        saveTasksToLocalStorage(tasks);
    }, [tasks]);

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

    return (
        <div className="main-page">
            <div className="task-list">
                <h1>Task List</h1>
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
                <button className="add-task-button" onClick={handleAddTask}>Add Task</button>
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
    );
}
