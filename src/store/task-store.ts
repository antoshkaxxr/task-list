import { makeAutoObservable } from "mobx";
import { generateId } from "../helper-functions/helper-functions";

export class TaskStore {
    tasks: Task[] = [];
    selectedTask: Task | null = null;
    theme: string = "system";

    constructor() {
        makeAutoObservable(this);
        this.loadTasks();
        this.loadTheme();
    }

    loadTasks() {
        const tasks = localStorage.getItem("tasks");
        this.tasks = tasks ? JSON.parse(tasks) : [];
    }

    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    loadTheme() {
        this.theme = localStorage.getItem("theme") || "system";
    }

    saveTheme() {
        localStorage.setItem("theme", this.theme);
        document.body.className = this.theme;
    }

    addTask() {
        const newTask: Task = {
            id: generateId(),
            title: "New Task",
            description: "",
            subtasks: [],
            completed: false,
            expanded: false,
        };
        this.tasks.push(newTask);
        this.saveTasks();
    }

    updateTask(updatedTask: Task) {
        this.tasks = this.tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
        this.saveTasks();
    }

    deleteTask(id: string) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
    }

    setSelectedTask(task: Task | null) {
        this.selectedTask = task;
    }

    setTheme(newTheme: string) {
        this.theme = newTheme;
        this.saveTheme();
    }
}

export const taskStore = new TaskStore();
