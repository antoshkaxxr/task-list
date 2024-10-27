import { TaskStore } from "../store/task-store";

jest.mock("../helper-functions/helper-functions", () => {
    return {
        generateId: jest.fn(() => String(Math.random()))
    };
});

describe("TaskStore", () => {
    let store: TaskStore;

    beforeEach(() => {
        localStorage.clear();
    });

    test("should load tasks from localStorage", () => {
        localStorage.setItem("tasks", JSON.stringify([{ id: "1", title: "Test Task", description: "" }]));

        const newStore = new TaskStore();
        expect(newStore.tasks.length).toBe(1);
        expect(newStore.tasks[0].title).toBe("Test Task");
    });

    test("should save tasks to localStorage when tasks are updated", () => {
        store = new TaskStore();
        const task = { id: "1", title: "Test Task", description: "", subtasks: [], completed: false, expanded: false };
        store.tasks.push(task);
        store.saveTasks();

        const savedTasks = localStorage.getItem("tasks");
        expect(savedTasks).toBe(JSON.stringify(store.tasks));
    });

    test("should add a new task", () => {
        store = new TaskStore();
        store.addTask();
        console.log(store.tasks);
        expect(store.tasks.length).toBe(1);
        expect(store.tasks[0].title).toBe("New Task");
    });

    test("should update an existing task", () => {
        store = new TaskStore();
        store.addTask();
        const taskToUpdate = store.tasks[0];
        const updatedTask = { ...taskToUpdate, title: "Updated Task" };

        store.updateTask(updatedTask);

        const updatedTaskInStore = store.tasks[0];
        expect(updatedTaskInStore.title).toBe("Updated Task");
    });

    test("should delete a task", () => {
        store = new TaskStore();
        store.addTask();
        const taskId = store.tasks[0].id;

        store.deleteTask(taskId);

        expect(store.tasks.length).toBe(0);
    });

    test("should set and get selected task", () => {
        store = new TaskStore();
        store.addTask();
        const task = store.tasks[0];

        store.setSelectedTask(task);
        expect(store.selectedTask).toBe(task);

        store.setSelectedTask(null);
        expect(store.selectedTask).toBeNull();
    });

    test("should set and save the theme", () => {
        store = new TaskStore();
        store.setTheme("dark");
        expect(store.theme).toBe("dark");
        expect(localStorage.getItem("theme")).toBe("dark");
    });

    test("should load the theme from localStorage", () => {
        store = new TaskStore();
        localStorage.setItem("theme", "light");

        const newStore = new TaskStore();
        expect(newStore.theme).toBe("light");
    });
});
