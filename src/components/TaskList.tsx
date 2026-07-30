import { useState } from "react";
import { toggleTaskCompleted, deleteTask, updateTask } from "../services/taskService";
import type { Task } from "../types/task";

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);

  if (tasks.length === 0) {
    return <p className="empty-state">No tenés tareas todavía. ¡Agregá la primera!</p>;
  }

  function startEditing(task: Task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  }

  async function saveEditing(taskId: string) {
    if (!editTitle.trim()) return;
    setSaving(true);
    try {
      await updateTask(taskId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      cancelEditing();
    } catch (err) {
      console.error("Error al editar tarea:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const isEditing = editingId === task.id;

        if (isEditing) {
          return (
            <li key={task.id} className="task-item task-item-editing">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Título"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Descripción"
                rows={2}
              />
              <div className="task-item-actions">
                <button
                  className="btn-primary"
                  onClick={() => saveEditing(task.id)}
                  disabled={saving || !editTitle.trim()}
                >
                  Guardar
                </button>
                <button className="btn-secondary" onClick={cancelEditing} disabled={saving}>
                  Cancelar
                </button>
              </div>
            </li>
          );
        }

        return (
          <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompleted(task.id, !task.completed)}
            />
            <div className="task-item-content">
              <span className="task-title">{task.title}</span>
              {task.description && <p className="task-description">{task.description}</p>}
            </div>
            <div className="task-item-actions">
              <button className="btn-secondary" onClick={() => startEditing(task)}>
                Editar
              </button>
              <button className="btn-delete" onClick={() => deleteTask(task.id)}>
                Eliminar
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
