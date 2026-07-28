import { useState, type FormEvent } from "react";
import { loginUser } from "../services/authService";
import { getAuthErrorMessage } from "../utils/authErrors";
import { FirebaseError } from "firebase/app";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginUser(email, password);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(getAuthErrorMessage(err.code));
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
} 