import { LogoutButton } from "./components/LogoutButton";
import { useAuth } from "./features/auth/useAuth";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <p>{user ? `Sesión activa: ${user.email}` : "No hay sesión activa"}</p>
      <LogoutButton />
    </div>
  );
}

export default App;