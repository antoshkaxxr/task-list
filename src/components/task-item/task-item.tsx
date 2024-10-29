import React, {useEffect, useState} from "react";
import { generateId } from "../../helper-functions/helper-functions";
import { Modal } from "../modal/modal";
import './task-item-styles.scss';
import { observer } from "mobx-react-lite"

const areAllSubtasksCompleted = (task: Task): boolean => {
    if (task.subtasks.length === 0) {
        return task.completed;
    }

    for (let subtask of task.subtasks) {
        if (!subtask.completed) {
            return false;
        }
    }

    return true;
};


export const TaskItem = observer(({ task, onUpdate, onDelete, onSelect }: TaskItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);

    useEffect(() => {
        if (task.completed && !areAllSubtasksCompleted(task)) {
            const updatedTask = {
                ...task,
                completed: false
            }
            onUpdate(updatedTask);
        }

        if (!task.completed && areAllSubtasksCompleted(task)) {
            const updatedTask = {
                ...task,
                completed: true
            };
            onUpdate(updatedTask);
        }
    }, [task.subtasks]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const completed = event.target.checked;

        const updateSubtaskCompletion = (subtasks: Task[], completed: boolean): Task[] => {
            return subtasks.map(subtask => ({
                ...subtask,
                completed,
                subtasks: updateSubtaskCompletion(subtask.subtasks, completed),
            }));
        };

        const updatedTask: Task = {
            ...task,
            completed,
            subtasks: updateSubtaskCompletion(task.subtasks, completed),
        };

        onUpdate(updatedTask);
    };

    const handleExpand = () => {
        const updatedTask = { ...task, expanded: !task.expanded };
        onUpdate(updatedTask);
    };

    const handleEdit = () => {
        setTitle(task.title);
        setDescription(task.description);
        setIsEditing(true);
    };

    const handleSave = () => {
        const updatedTask = { ...task, title, description };
        onUpdate(updatedTask);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete(task.id);
    };

    const handleAddSubtask = () => {
        const newSubtask = {
            id: generateId(),
            title: "New Subtask",
            description: "",
            subtasks: [],
            completed: false,
            expanded: false,
            parentTask: task
        };
        const updatedTask = { ...task, expanded: true, subtasks: [...task.subtasks, newSubtask] };
        onUpdate(updatedTask);
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`} onClick={() => onSelect(task)}>
            <div className="task-header">
                <input
                    type="checkbox"
                    checked={areAllSubtasksCompleted(task)}
                    onChange={handleCheckboxChange}
                />
                <div onClick={handleExpand} className="expand-button">
                    {task.expanded ? "▼" : "▶"} {task.title}
                </div>
                <div className="task-buttons">
                    <button onClick={handleEdit}>
                        <img src={`https://antoshkaxxr.github.io/task-list/icons/icon-edit.svg`} alt="Редактировать" />
                    </button>
                    <button onClick={handleDelete}>
                        <img src={`https://antoshkaxxr.github.io/task-list/icons/icon-delete.svg`} alt="Удалить" />
                    </button>
                    <button onClick={handleAddSubtask}>
                        <img src={`https://antoshkaxxr.github.io/task-list/icons/icon-add.svg`} alt="Добавить подзадачу" />
                    </button>
                </div>
            </div>
            {task.expanded && (
                <div>
                    {task.subtasks && task.subtasks.length > 0 && (
                        <div className="subtasks">
                            {task.subtasks.map((subtask) => (
                                <div onClick={(event) => {
                                    event.stopPropagation();
                                    onSelect(subtask);
                                }} key={subtask.id}>
                                    <TaskItem
                                        task={subtask}
                                        onUpdate={(updatedSubtask) =>
                                            onUpdate({
                                                ...task,
                                                subtasks: task.subtasks.map(t => t.id === updatedSubtask.id ? updatedSubtask : t),
                                            })
                                        }
                                        onDelete={(id) =>
                                            onUpdate({
                                                ...task,
                                                subtasks: task.subtasks.filter(t => t.id !== id),
                                            })
                                        }
                                        onSelect={(subtask) => onSelect(subtask)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <Modal
                isVisible={isEditing}
                onClose={() => setIsEditing(false)}
                onSave={handleSave}
                title={title}
                description={description}
                setTitle={setTitle}
                setDescription={setDescription}
            />
        </div>
    );
});
