import React, { useState } from "react";
import { generateId } from "../../helper-functions/helper-functions";
import { Modal } from "../modal/modal";
import './task-item-styles.scss';

export function TaskItem({ task, onUpdate, onDelete, onSelect }: TaskItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const completed = event.target.checked;

        const updatedTask = {
            ...task,
            completed,
            subtasks: task.subtasks.map(subtask => ({
                ...subtask,
                completed,
            })),
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
        task.expanded = true;
        const newSubtask = {
            id: generateId(),
            title: "New Subtask",
            description: "",
            subtasks: [],
            completed: false,
            expanded: false,
        };
        const updatedTask = { ...task, subtasks: [...task.subtasks, newSubtask] };
        onUpdate(updatedTask);
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`} onClick={() => onSelect(task)}>
            <div className="task-header">
                <input
                    type="checkbox"
                    checked={task.subtasks.length > 0 ?
                        task.subtasks.every(subtask => subtask.completed) :
                        task.completed}
                    onChange={handleCheckboxChange}
                />
                <div onClick={handleExpand} className="expand-button">
                    {task.expanded ? "▼" : "▶"} {task.title}
                </div>
                <div className="task-buttons">
                    <button onClick={handleEdit}>
                        <img src="/icons/icon-edit.svg" alt="Редактировать" />
                    </button>
                    <button onClick={handleDelete}>
                        <img src="/icons/icon-delete.svg" alt="Удалить" />
                    </button>
                    <button onClick={handleAddSubtask}>
                        <img src="/icons/icon-add.svg" alt="Добавить подзадачу" />
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
}
