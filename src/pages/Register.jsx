import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600&family=DM+Sans:wght@300;400;500&display=swap');
.auth-wrap{font-family:'DM Sans',sans-serif;min-height:100vh;background:#FAFAF7;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;}
.auth-logo{font-family:'Fraunces',serif;font-size:24px;font-weight:600;color:#1C1917;margin-bottom:32px;}
.auth-logo span{color:#2D6A4F;}
.auth-card{background:white;border:1.5px solid #EDE5D8;border-radius:20px;padding:36px;width:100%;max-width:400px;}
.auth-card h1{font-family:'Fraunces',serif;font-size:26px;font-weight:500;color:#1C1917;margin-bottom:6px;}
.auth-card p{font-size:14px;color:#78716C;margin-bottom:28px;}
.auth-label{font-size:12px;font-weight:500;color:#78716C;margin-bottom:6px;display:block;}
.auth-input{width:100%;padding:12px 16px;border-radius:12px;border:1.5px solid #EDE5D8;font-family:'DM Sans',sans-serif;font-size:15px;background:#FAFAF7;color:#1C1917;outline:none;transition:border-color .2s;margin-bottom:16px;}
.auth-input:focus{border-color:#2D6A4F;}
.auth-btn{width:100%;background:#1C1917;color:#FAFAF7;border:none;padding:14px;border-radius:40px;font-size:15px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:background .2s;margin-top:4px;}
.auth-btn:hover{background:#2D6A4F;}
.auth-btn:disabled{background:#D6D3D1;cursor:not-allowed;}
.auth-error{background:#FEE2E2;color:#991B1B;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:16px;}
.auth-success{background:#D8F3DC;color:#1B4332;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:16px;}
.auth-divider{text-align:center;font-size:13px;color:#78716C;margin:20px 0;}
.auth-link{color:#2D6A4F;text-decoration:none;font-weight:500;}
.auth-link:hover{text-decoration:underline;}
.plan-chips{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
.plan-chip{font-size:12px;padding:4px 12px;border-radius:40px;background:#F5F0E8;color:#78716C;}
.plan-chip.free{background:#D8F3DC;color:#1B4332;}
`;

export default function Register() {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("Las contraseñas no coinciden.");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    setLoading(true);
    const { error } = await signUp(email, password);
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-logo">DislexiaLab<span>.</span></div>
      <div className="auth-card">
        <h1>Crea tu cuenta</h1>
        <p>Accede gratis y guarda el historial de tus evaluaciones.</p>
        <div className="plan-chips">
          <span className="plan-chip free">✓ Plan gratuito</span>
          <span className="plan-chip">1 evaluación incluida</span>
          <span className="plan-chip">Sin tarjeta</span>
        </div>
        {error && <div className="auth-error">{error}</div>}
        {success ? (
          <div className="auth-success">
            ✓ Cuenta creada. Revisa tu correo para confirmar y luego <Link to="/login" className="auth-link">inicia sesión</Link>.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="auth-label">Correo electrónico</label>
            <input className="auth-input" type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label className="auth-label">Contraseña</label>
            <input className="auth-input" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label className="auth-label">Confirmar contraseña</label>
            <input className="auth-input" type="password" placeholder="Repite tu contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
            </button>
          </form>
        )}
        <div className="auth-divider">
          ¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
