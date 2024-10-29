interface Task {
    id: string;
    title: string;
    description: string;
    subtasks: Task[];
    completed: boolean;
    expanded: boolean;
    parentTask?: Task;
}

interface TaskItemProps {
    task: Task;
    onUpdate: (task: Task) => void;
    onDelete: (id: string) => void;
    onSelect: (task: Task) => void;
}

