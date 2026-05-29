import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600&family=DM+Sans:wght@300;400;500&display=swap');
.db-wrap{font-family:'DM Sans',sans-serif;min-height:100vh;background:#FAFAF7;color:#1C1917;}
.db-nav{display:flex;align-items:center;justify-content:space-between;padding:0 clamp(16px,4vw,60px);height:60px;border-bottom:1px solid #EDE5D8;background:rgba(250,250,247,.95);backdrop-filter:blur(10px);position:sticky;top:0;z-index:50;}
.db-logo{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:#1C1917;cursor:pointer;}
.db-logo span{color:#2D6A4F;}
.db-nav-right{display:flex;align-items:center;gap:12px;}
.db-nav-email{font-size:13px;color:#78716C;}
.db-btn{background:#1C1917;color:#FAFAF7;border:none;padding:9px 20px;border-radius:40px;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:background .2s;}
.db-btn:hover{background:#2D6A4F;}
.db-btn-outline{background:transparent;color:#1C1917;border:1.5px solid #EDE5D8;padding:9px 20px;border-radius:40px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;}
.db-btn-outline:hover{border-color:#1C1917;}
.db-body{max-width:1000px;margin:0 auto;padding:clamp(32px,5vw,56px) clamp(16px,4vw,40px);}
.db-greeting{font-family:'Fraunces',serif;font-size:clamp(22px,4vw,32px);font-weight:500;color:#1C1917;margin-bottom:4px;}
.db-sub{font-size:14px;color:#78716C;margin-bottom:32px;}
.db-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px;}
.db-metric{background:white;border:1.5px solid #EDE5D8;border-radius:16px;padding:18px 20px;}
.db-metric-label{font-size:12px;color:#78716C;margin-bottom:6px;}
.db-metric-val{font-family:'Fraunces',serif;font-size:28px;font-weight:500;color:#1C1917;line-height:1;}
.db-metric-badge{display:inline-block;font-size:11px;padding:2px 8px;border-radius:20px;margin-top:6px;}
.badge-green{background:#D8F3DC;color:#1B4332;}
.badge-amber{background:#FEF3C7;color:#78350F;}
.badge-red{background:#FEE2E2;color:#7F1D1D;}
.badge-gray{background:#F5F0E8;color:#78716C;}
.db-section-title{font-size:15px;font-weight:500;color:#1C1917;margin-bottom:14px;}
.db-progress-card{background:white;border:1.5px solid #EDE5D8;border-radius:16px;padding:24px;margin-bottom:24px;}
.db-areas-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;}
.db-area-card{background:white;border:1.5px solid #EDE5D8;border-radius:14px;padding:16px 18px;}
.db-area-name{font-size:12px;color:#78716C;margin-bottom:4px;}
.db-area-score{font-family:'Fraunces',serif;font-size:26px;font-weight:500;margin-bottom:6px;}
.db-area-track{background:#EDE5D8;border-radius:40px;height:5px;}
.db-area-fill{height:5px;border-radius:40px;transition:width .8s ease;}
.score-ok{color:#2D6A4F;} .score-warn{color:#D97706;} .score-bad{color:#DC2626;}
.fill-ok{background:#2D6A4F;} .fill-warn{background:#D97706;} .fill-bad{background:#DC2626;}
.db-history{display:flex;flex-direction:column;gap:10px;margin-bottom:24px;}
.db-history-row{display:flex;align-items:center;justify-content:space-between;background:white;border:1.5px solid #EDE5D8;border-radius:14px;padding:14px 18px;transition:border-color .2s;}
.db-history-row:hover{border-color:#2D6A4F;}
.db-history-left{display:flex;align-items:center;gap:12px;}
.db-history-icon{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:500;flex-shrink:0;}
.db-history-name{font-size:14px;font-weight:500;color:#1C1917;}
.db-history-date{font-size:12px;color:#78716C;}
.db-risk-pill{font-size:11px;font-weight:500;padding:3px 10px;border-radius:20px;}
.risk-bajo{background:#D8F3DC;color:#1B4332;}
.risk-moderado{background:#FEF3C7;color:#78350F;}
.risk-alto{background:#FEE2E2;color:#7F1D1D;}
.db-chart{display:flex;align-items:flex-end;gap:8px;height:120px;padding:0 4px;}
.db-bar-wrap{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;}
.db-bar{border-radius:6px 6px 0 0;width:100%;transition:height .8s ease;min-height:4px;}
.db-bar-label{font-size:10px;color:#78716C;text-align:center;}
.db-bar-val{font-size:11px;font-weight:500;color:#1C1917;}
.db-empty{text-align:center;padding:48px 24px;background:white;border:1.5px solid #EDE5D8;border-radius:16px;}
.db-empty-icon{font-size:40px;margin-bottom:12px;}
.db-empty h3{font-family:'Fraunces',serif;font-size:18px;font-weight:500;color:#1C1917;margin-bottom:6px;}
.db-empty p{font-size:14px;color:#78716C;margin-bottom:20px;}
.db-actions{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:32px;}
.db-spinner{width:32px;height:32px;border:3px solid #EDE5D8;border-top-color:#2D6A4F;border-radius:50%;animation:spin .8s linear infinite;margin:40px auto;}
@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:600px){.db-metrics{grid-template-columns:1fr 1fr;}.db-areas-grid{grid-template-columns:1fr 1fr;}}
`;

const areaLabels = { fonologica:"Fonológica", letras:"Inversión letras", secuencial:"Secuencial", lectora:"Velocidad lectora" };

function scoreColor(s){ return s>=75?"score-ok":s>=45?"score-warn":"score-bad"; }
function fillColor(s){ return s>=75?"fill-ok":s>=45?"fill-warn":"fill-bad"; }
function barColor(s){ return s>=75?"#2D6A4F":s>=45?"#D97706":"#DC2626"; }

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    const { data: patients } = await supabase
      .from("patients").select("id,nombre,edad,created_at");
    if (!patients?.length) { setLoading(false); return; }

    const ids = patients.map(p => p.id);
    const { data: testSessions } = await supabase
      .from("test_sessions").select("id,patient_id,score,fecha")
      .in("patient_id", ids).order("fecha", { ascending: false });

    const { data: reports } = await supabase
      .from("ai_reports").select("session_id,perfil_riesgo,areas")
      .in("session_id", (testSessions||[]).map(s=>s.id));

    const combined = (testSessions||[]).map(s => {
      const patient = patients.find(p=>p.id===s.patient_id);
      const report = (reports||[]).find(r=>r.session_id===s.id);
      return { ...s, patient, report };
    });

    setSessions(combined);
    setLoading(false);
  };

  // Métricas
  const totalTests = sessions.length;
  const avgScore = totalTests ? Math.round(sessions.reduce((a,s)=>a+(s.score||0),0)/totalTests) : 0;
  const lastSession = sessions[0];
  const lastRisk = lastSession?.report?.perfil_riesgo || "—";

  // Promedio por área
  const areaAvgs = { fonologica:0, letras:0, secuencial:0, lectora:0 };
  if (totalTests) {
    sessions.forEach(s => {
      if (s.report?.areas) {
        Object.keys(areaAvgs).forEach(k => { areaAvgs[k] += (s.report.areas[k]||0); });
      }
    });
    Object.keys(areaAvgs).forEach(k => { areaAvgs[k] = Math.round(areaAvgs[k]/totalTests); });
  }

  // Datos para gráfica (últimos 6 tests)
  const chartData = [...sessions].reverse().slice(-6);

  const riskConfig = {
    bajo: { pill:"risk-bajo", icon:"🟢", label:"Riesgo bajo" },
    moderado: { pill:"risk-moderado", icon:"🟡", label:"Riesgo moderado" },
    alto: { pill:"risk-alto", icon:"🔴", label:"Riesgo alto" },
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("es-CO", { day:"numeric", month:"short", year:"numeric" });
  };

  return (
    <div className="db-wrap">
      <nav className="db-nav">
        <span className="db-logo" onClick={() => navigate("/")} >DislexiaLab<span>.</span></span>
        <div className="db-nav-right">
          <span className="db-nav-email">{user?.email}</span>
          <button className="db-btn-outline" onClick={() => navigate("/ejercicios")}>Ejercicios</button>
          <button className="db-btn" onClick={() => navigate("/test")}>Nuevo test</button>
          <button className="db-btn-outline" onClick={signOut}>Salir</button>
        </div>
      </nav>

      <div className="db-body">
        <div className="db-greeting">Mi dashboard</div>
        <div className="db-sub">{user?.email} · Historial de evaluaciones y progreso</div>

        {loading ? (
          <div className="db-spinner" />
        ) : totalTests === 0 ? (
          <div className="db-empty">
            <div className="db-empty-icon">🧩</div>
            <h3>Aún no tienes evaluaciones</h3>
            <p>Realiza tu primer test de cribado para ver tu progreso aquí.</p>
            <button className="db-btn" onClick={() => navigate("/test")}>Hacer primer test →</button>
          </div>
        ) : (
          <>
            {/* MÉTRICAS */}
            <div className="db-metrics">
              <div className="db-metric">
                <div className="db-metric-label">Tests realizados</div>
                <div className="db-metric-val">{totalTests}</div>
                <span className="db-metric-badge badge-gray">histórico</span>
              </div>
              <div className="db-metric">
                <div className="db-metric-label">Puntaje promedio</div>
                <div className="db-metric-val">{avgScore}%</div>
                <span className={`db-metric-badge ${avgScore>=75?"badge-green":avgScore>=50?"badge-amber":"badge-red"}`}>
                  {avgScore>=75?"Bueno":avgScore>=50?"Regular":"Bajo"}
                </span>
              </div>
              <div className="db-metric">
                <div className="db-metric-label">Último resultado</div>
                <div className="db-metric-val">{lastSession?.score||0}%</div>
                <span className={`db-metric-badge ${riskConfig[lastRisk]?.pill||"badge-gray"}`}>
                  {riskConfig[lastRisk]?.label||"—"}
                </span>
              </div>
              <div className="db-metric">
                <div className="db-metric-label">Área más débil</div>
                <div className="db-metric-val" style={{fontSize:"18px",paddingTop:"4px"}}>
                  {areaLabels[Object.entries(areaAvgs).sort((a,b)=>a[1]-b[1])[0]?.[0]] || "—"}
                </div>
                <span className="db-metric-badge badge-amber">reforzar</span>
              </div>
            </div>

            {/* GRÁFICA DE PROGRESO */}
            {chartData.length > 1 && (
              <div className="db-progress-card" style={{marginBottom:"24px"}}>
                <div className="db-section-title">Evolución del puntaje</div>
                <div className="db-chart">
                  {chartData.map((s, i) => (
                    <div className="db-bar-wrap" key={i}>
                      <div className="db-bar-val">{s.score}%</div>
                      <div className="db-bar" style={{ height:`${s.score}%`, background: barColor(s.score) }} />
                      <div className="db-bar-label">{new Date(s.fecha).toLocaleDateString("es-CO",{day:"numeric",month:"short"})}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ÁREAS */}
            <div className="db-section-title">Promedio por área</div>
            <div className="db-areas-grid">
              {Object.entries(areaAvgs).map(([key, val]) => (
                <div className="db-area-card" key={key}>
                  <div className="db-area-name">{areaLabels[key]}</div>
                  <div className={`db-area-score ${scoreColor(val)}`}>{val}%</div>
                  <div className="db-area-track">
                    <div className={`db-area-fill ${fillColor(val)}`} style={{width:`${val}%`}} />
                  </div>
                </div>
              ))}
            </div>

            {/* HISTORIAL */}
            <div className="db-section-title">Historial de tests</div>
            <div className="db-history">
              {sessions.map((s, i) => {
                const risk = riskConfig[s.report?.perfil_riesgo] || riskConfig.moderado;
                const colors = ["#D8F3DC","#EEF2FF","#FEF3C7","#FDE8E1"];
                const textColors = ["#1B4332","#3730A3","#78350F","#9B2C2C"];
                return (
                  <div className="db-history-row" key={i}>
                    <div className="db-history-left">
                      <div className="db-history-icon" style={{background:colors[i%4],color:textColors[i%4]}}>
                        {s.patient?.nombre?.[0]?.toUpperCase()||"?"}
                      </div>
                      <div>
                        <div className="db-history-name">{s.patient?.nombre || "Paciente"}</div>
                        <div className="db-history-date">{formatDate(s.fecha)} · {s.score}% correctas</div>
                      </div>
                    </div>
                    <span className={`db-risk-pill ${risk.pill}`}>{risk.label}</span>
                  </div>
                );
              })}
            </div>

            {/* ACCIONES */}
            <div className="db-actions">
              <button className="db-btn" onClick={() => navigate("/test")}>Nuevo test →</button>
              <button className="db-btn-outline" onClick={() => navigate("/ejercicios")}>Ver ejercicios →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
