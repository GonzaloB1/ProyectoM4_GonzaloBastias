import { LogoutButton } from "../components/LogoutButton";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { useAuth } from "../features/auth/useAuth";
import { useTasks } from "../hooks/useTasks";

export function Tasks() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks();

  return (
    <div>
      <h1>Mis tareas</h1>
      <p>Sesión activa: {user?.email}</p>
      <LogoutButton />

      <TaskForm />

      {loading ? <p>Cargando tareas...</p> : <TaskList tasks={tasks} />}
    </div>
  );
}