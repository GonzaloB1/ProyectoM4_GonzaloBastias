import { logoutUser } from "../services/authService";

export function LogoutButton() {
  async function handleLogout() {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  }

  return (
    <button className="btn-secondary" onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}