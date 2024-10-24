import React from "react";
import ReactDOM from "react-dom";
import './modal-styles.scss';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSave: () => void;
    title: string;
    description: string;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
}

export function Modal({isVisible, onClose, onSave, title, description, setTitle, setDescription} : ModalProps) {
    if (!isVisible) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Task</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task Description"
                />
                <button onClick={onSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>,
        document.getElementById("modal-root")!
    );
}
