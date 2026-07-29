import { useState } from "react";
import { LogoutButton } from "../components/LogoutButton";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { useAuth } from "../features/auth/useAuth";
import { useTasks } from "../hooks/useTasks";
import { sendTaskSummary } from "../services/emailService";

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
    <div>
      <h1>Mis tareas</h1>
      <p>Sesión activa: {user?.email}</p>
      <LogoutButton />

      <TaskForm />

      {loading ? <p>Cargando tareas...</p> : <TaskList tasks={tasks} />}

      <button onClick={handleSendSummary} disabled={sendingEmail || tasks.length === 0}>
        {sendingEmail ? "Enviando..." : "Enviar resumen por email"}
      </button>
      {emailStatus && <p>{emailStatus}</p>}
    </div>
  );
}