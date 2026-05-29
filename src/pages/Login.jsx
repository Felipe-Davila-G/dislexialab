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
`;

export default function Login() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error.message === "Invalid login credentials" ? "Correo o contraseña incorrectos." : error.message);
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-logo">DislexiaLab<span>.</span></div>
      <div className="auth-card">
        <h1>Bienvenido de nuevo</h1>
        <p>Ingresa para ver el historial y reportes de tus pacientes.</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="auth-label">Correo electrónico</label>
          <input className="auth-input" type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label className="auth-label">Contraseña</label>
          <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <div className="auth-divider">
          ¿No tienes cuenta? <Link to="/registro" className="auth-link">Regístrate gratis</Link>
        </div>
      </div>
    </div>
  );
}
