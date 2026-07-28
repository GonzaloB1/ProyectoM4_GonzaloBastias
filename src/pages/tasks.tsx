import { LogoutButton } from "../components/LogoutButton";
import { useAuth } from "../features/auth/useAuth";

export function Tasks() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Mis tareas</h1>
      <p>Sesión activa: {user?.email}</p>
      <LogoutButton />
    </div>
  );
}