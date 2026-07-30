import { toggleTaskCompleted, deleteTask } from "../services/taskService";
import type { Task } from "../types/task";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tenés tareas todavía. ¡Agregá la primera!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTaskCompleted(task.id, !task.completed)}
          />
          <span>{task.title}</span>
          <button className="btn-delete" onClick={() => deleteTask(task.id)}>
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}