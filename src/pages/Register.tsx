import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { getAuthErrorMessage } from "../utils/authErrors";
import { FirebaseError } from "firebase/app";
import "./AuthForm.css";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password);
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
            Empezá a <span className="highlight">organizarte hoy.</span>
          </h2>
          <p>Creá tu cuenta y accedé a tus tareas desde cualquier lugar.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Crear cuenta</h1>
          <p className="subtitle">Es gratis y te lleva un minuto.</p>

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="switch-link">
            ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}