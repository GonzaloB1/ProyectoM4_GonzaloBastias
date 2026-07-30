import { useState, type FormEvent } from "react";
import { createTask } from "../services/taskService";
import { useAuth } from "../features/auth/useAuth";

export function TaskForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || !title.trim()) return;

    setLoading(true);
    try {
      await createTask({ title: title.trim(), userId: user.uid });
      setTitle("");
    } catch (err) {
      console.error("Error al crear tarea:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nueva tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn-primary" type="submit" disabled={loading || !title.trim()}>
      Agregar
      </button>
      
    </form>
  );
}