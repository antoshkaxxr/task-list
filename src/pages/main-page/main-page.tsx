import React, { useEffect } from "react";
import { TaskItem } from "../../components/task-item/task-item";
import { taskStore } from "../../store/task-store";
import './main-page-styles.scss';
import { observer } from "mobx-react-lite";

const MainPage: React.FC = observer(() => {
    useEffect(() => {
        taskStore.saveTasks();
        taskStore.saveTheme();
    }, [taskStore.tasks, taskStore.theme]);

    return (
        <>
            <div className="theme-switcher">
                <button onClick={() => taskStore.setTheme("light")}>Светлая тема</button>
                <button onClick={() => taskStore.setTheme("dark")}>Темная тема</button>
            </div>
            <div className="main-page">
                <div className="task-list">
                    <h1>Список задач</h1>
                    {taskStore.tasks.length === 0 && <h3>Добавьте первую задачу!</h3>}
                    {taskStore.tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onUpdate={taskStore.updateTask.bind(taskStore)}
                            onDelete={taskStore.deleteTask.bind(taskStore)}
                            onSelect={taskStore.setSelectedTask.bind(taskStore)}
                        />
                    ))}
                    <button className="add-task-button" onClick={() => taskStore.addTask()}>Добавить задачу</button>
                </div>
                <div className="task-details">
                    {taskStore.selectedTask && (
                        <>
                            <h2>{taskStore.selectedTask.title}</h2>
                            <p>{taskStore.selectedTask.description}</p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
});

export default MainPage;
