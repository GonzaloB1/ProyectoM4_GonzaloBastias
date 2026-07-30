import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { getAuthErrorMessage } from "../utils/authErrors";
import { FirebaseError } from "firebase/app";
import "./AuthForm.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate("/");
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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <p className="brand-name">MateCode</p>
          <h2>
            Tus tareas, <span className="highlight">en un solo lugar.</span>
          </h2>
          <p>Organizá tus tareas y mantené el foco sin distracciones.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Iniciar sesión</h1>
          <p className="subtitle">Ingresá a tu cuenta para ver tus tareas.</p>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          <p className="switch-link">
            ¿No tenés cuenta? <Link to="/register">Crear cuenta</Link>
          </p>
        </form>
      </div>
    </div>
  );
}