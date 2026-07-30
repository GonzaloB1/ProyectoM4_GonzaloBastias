import { useState } from "react";
import { LogoutButton } from "../components/LogoutButton";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { useAuth } from "../features/auth/useAuth";
import { useTasks } from "../hooks/useTasks";
import { sendTaskSummary } from "../services/emailService";
import "./Tasks.css";

export function Tasks() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  async function handleSendSummary() {
    if (!user?.email) return;

    setSendingEmail(true);
    setEmailStatus(null);
    try {
      await sendTaskSummary(user.email, tasks);
      setEmailStatus("Resumen enviado con éxito.");
    } catch (err) {
      setEmailStatus("No se pudo enviar el resumen.");
      console.error(err);
    } finally {
      setSendingEmail(false);
    }
  }

  return (
    <div className="tasks-page">
      <div className="tasks-topbar">
        <div>
          <p className="brand-name">MateCode</p>
          <div className="user-info">
            <p>Sesión activa: {user?.email}</p>
          </div>
        </div>
        <LogoutButton />
      </div>

      <div className="tasks-grid">
        <div className="card card-form">
          <h2>Nueva tarea</h2>
          <TaskForm />
        </div>

        <div className="card card-list">
          <h2>Mis tareas</h2>
          {loading ? <p className="empty-state">Cargando tareas...</p> : <TaskList tasks={tasks} />}

          <div className="email-card" style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--color-border)" }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: "0.2rem", color: "var(--color-text)" }}>Resumen por email</p>
              <p>Recibí un resumen de tus tareas en tu correo.</p>
            </div>
            <button className="btn-secondary" onClick={handleSendSummary} disabled={sendingEmail || tasks.length === 0}>
              {sendingEmail ? "Enviando..." : "Enviar resumen"}
            </button>
          </div>
          {emailStatus && <p className="email-status">{emailStatus}</p>}
        </div>
      </div>
    </div>
  );
}