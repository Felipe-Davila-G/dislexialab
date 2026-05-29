import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const styles = `
.res-wrap { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #FAFAF7; color: #1C1917; }
.res-nav { display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(16px,4vw,60px); height: 60px; border-bottom: 1px solid #EDE5D8; background: rgba(250,250,247,.95); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 50; }
.res-logo { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; color: #1C1917; }
.res-logo span { color: #2D6A4F; }
.res-body { max-width: 680px; margin: 0 auto; padding: clamp(32px,5vw,60px) clamp(16px,4vw,40px); }

.res-header { margin-bottom: 24px; }
.res-tag { display: inline-block; font-size: 11px; font-weight: 500; letter-spacing: .07em; text-transform: uppercase; color: #2D6A4F; margin-bottom: 10px; }
.res-title { font-family: 'Fraunces', serif; font-size: clamp(24px,4vw,34px); font-weight: 500; color: #1C1917; margin-bottom: 4px; }
.res-sub { font-size: 14px; color: #78716C; }

.risk-card { border-radius: 20px; padding: 24px 28px; margin-bottom: 20px; display: flex; align-items: center; gap: 20px; }
.risk-low { background: #D8F3DC; border: 1.5px solid #B7E4C7; }
.risk-mid { background: #FEF3C7; border: 1.5px solid #FDE68A; }
.risk-high { background: #FEE2E2; border: 1.5px solid #FECACA; }
.risk-icon { font-size: 36px; flex-shrink: 0; }
.risk-label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 4px; }
.risk-low .risk-label { color: #2D6A4F; }
.risk-mid .risk-label { color: #92400E; }
.risk-high .risk-label { color: #991B1B; }
.risk-name { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 500; color: #1C1917; margin-bottom: 2px; }
.risk-desc { font-size: 13px; color: #44403C; }

.score-row { display: flex; align-items: center; gap: 16px; background: white; border: 1.5px solid #EDE5D8; border-radius: 16px; padding: 18px 24px; margin-bottom: 20px; }
.score-circle { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; flex-shrink: 0; }
.score-low { background: #D8F3DC; color: #1B4332; }
.score-mid { background: #FEF3C7; color: #78350F; }
.score-high { background: #FEE2E2; color: #7F1D1D; }
.score-info { flex: 1; }
.score-label { font-size: 12px; color: #78716C; margin-bottom: 2px; }
.score-val { font-size: 15px; font-weight: 500; color: #1C1917; }
.score-track { background: #EDE5D8; border-radius: 40px; height: 6px; margin-top: 8px; }
.score-fill { height: 6px; border-radius: 40px; transition: width 1s ease; }
.fill-low { background: #2D6A4F; }
.fill-mid { background: #D97706; }
.fill-high { background: #DC2626; }

.areas-title { font-size: 13px; font-weight: 500; color: #1C1917; margin-bottom: 12px; }
.areas-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
.area-card { background: white; border: 1.5px solid #EDE5D8; border-radius: 14px; padding: 16px; }
.area-name { font-size: 12px; color: #78716C; margin-bottom: 6px; }
.area-score { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 500; margin-bottom: 6px; }
.area-ok { color: #2D6A4F; }
.area-warn { color: #D97706; }
.area-bad { color: #DC2626; }
.area-track { background: #EDE5D8; border-radius: 40px; height: 4px; }
.area-fill { height: 4px; border-radius: 40px; }

.ai-card { background: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 16px; padding: 20px 24px; margin-bottom: 20px; }
.ai-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.ai-card-title { font-size: 13px; font-weight: 500; color: #14532D; }
.ai-spark { font-size: 14px; }
.ai-text { font-size: 14px; color: #166534; line-height: 1.7; }

.meta-row { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
.meta-chip { background: #F5F0E8; border-radius: 40px; padding: 6px 14px; font-size: 13px; color: #78716C; display: flex; align-items: center; gap: 6px; }

.res-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.res-btn { background: #1C1917; color: #FAFAF7; border: none; padding: 13px 28px; border-radius: 40px; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background .2s, transform .15s; }
.res-btn:hover { background: #2D6A4F; transform: translateY(-1px); }
.res-btn-outline { background: transparent; color: #1C1917; border: 1.5px solid #EDE5D8; padding: 13px 28px; border-radius: 40px; font-size: 14px; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .2s; }
.res-btn-outline:hover { border-color: #1C1917; }

.upgrade-banner { background: #1C1917; border-radius: 16px; padding: 20px 24px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.upgrade-text h4 { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 500; color: #FAFAF7; margin-bottom: 4px; }
.upgrade-text p { font-size: 13px; color: rgba(250,250,247,.6); }
.upgrade-btn { background: #2D6A4F; color: white; border: none; padding: 10px 20px; border-radius: 40px; font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; white-space: nowrap; transition: background .2s; }
.upgrade-btn:hover { background: #1B4332; }
`;

const areaLabels = {
  fonologica: "Conciencia fonológica",
  letras: "Inversión de letras",
  secuencial: "Memoria secuencial",
  lectora: "Velocidad lectora",
};

function areaColor(score) {
  if (score >= 75) return "area-ok";
  if (score >= 45) return "area-warn";
  return "area-bad";
}

function areaFill(score) {
  if (score >= 75) return "#2D6A4F";
  if (score >= 45) return "#D97706";
  return "#DC2626";
}

export default function Resultado() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Si alguien entra directo sin hacer el test
  if (!state) {
    return (
      <div className="res-wrap">
        <nav className="res-nav">
          <span className="res-logo">DislexiaLab<span>.</span></span>
        </nav>
        <div className="res-body" style={{ textAlign: "center", paddingTop: "80px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧩</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "24px", marginBottom: "8px" }}>
            No hay resultados aún
          </h2>
          <p style={{ color: "#78716C", marginBottom: "24px" }}>
            Primero debes completar el test de cribado.
          </p>
          <button className="res-btn" onClick={() => navigate("/test")}>
            Ir al test →
          </button>
        </div>
      </div>
    );
  }

  const { nombre, score, areas, avgTime, recomendaciones, perfilRiesgo } = state;

  const riskConfig = {
    bajo: { cls: "risk-low", icon: "🟢", label: "Riesgo bajo", desc: "No se detectaron indicadores significativos de dislexia.", scoreCls: "score-low", fillCls: "fill-low" },
    moderado: { cls: "risk-mid", icon: "🟡", label: "Riesgo moderado", desc: "Se detectaron algunos indicadores. Se recomienda seguimiento.", scoreCls: "score-mid", fillCls: "fill-mid" },
    alto: { cls: "risk-high", icon: "🔴", label: "Riesgo alto", desc: "Se detectaron varios indicadores. Se recomienda evaluación profesional.", scoreCls: "score-high", fillCls: "fill-high" },
  };

  const risk = riskConfig[perfilRiesgo] || riskConfig.moderado;

  return (
    <div className="res-wrap">
      <nav className="res-nav">
        <span className="res-logo">DislexiaLab<span>.</span></span>
        <button className="res-btn-outline" style={{ fontSize: "13px", padding: "7px 16px" }} onClick={() => navigate("/")}>
          ← Inicio
        </button>
      </nav>

      <div className="res-body">
        <div className="res-header">
          <div className="res-tag">Resultado del test</div>
          <div className="res-title">Reporte de {nombre}</div>
          <div className="res-sub">Test completado · Análisis generado con IA</div>
        </div>

        {/* RISK */}
        <div className={`risk-card ${risk.cls}`}>
          <div className="risk-icon">{risk.icon}</div>
          <div>
            <div className="risk-label">{risk.label}</div>
            <div className="risk-name">{nombre}</div>
            <div className="risk-desc">{risk.desc}</div>
          </div>
        </div>

        {/* META */}
        <div className="meta-row">
          <span className="meta-chip">📊 {score}% correctas</span>
          <span className="meta-chip">⏱ {avgTime}s promedio</span>
          <span className="meta-chip">❓ 7 preguntas</span>
        </div>

        {/* SCORE BAR */}
        <div className="score-row">
          <div className={`score-circle ${risk.scoreCls}`}>{score}%</div>
          <div className="score-info">
            <div className="score-label">Puntuación general</div>
            <div className="score-val">{score >= 80 ? "Dentro del rango esperado" : score >= 50 ? "Algunos indicadores presentes" : "Indicadores significativos detectados"}</div>
            <div className="score-track">
              <div className={`score-fill ${risk.fillCls}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        </div>

        {/* AREAS */}
        <div className="areas-title">Detalle por área</div>
        <div className="areas-grid">
          {Object.entries(areas).map(([key, val]) => (
            <div className="area-card" key={key}>
              <div className="area-name">{areaLabels[key]}</div>
              <div className={`area-score ${areaColor(val)}`}>{val}%</div>
              <div className="area-track">
                <div className="area-fill" style={{ width: `${val}%`, background: areaFill(val) }} />
              </div>
            </div>
          ))}
        </div>

        {/* AI */}
        <div className="ai-card">
          <div className="ai-card-header">
            <span className="ai-spark">✦</span>
            <span className="ai-card-title">Análisis generado por IA (Claude)</span>
          </div>
          <div className="ai-text">{recomendaciones}</div>
        </div>

        {/* UPGRADE */}
        <div className="upgrade-banner">
          <div className="upgrade-text">
            <h4>Obtén el reporte PDF completo</h4>
            <p>Historial de progreso, ejercicios personalizados y más con Pro Familia.</p>
          </div>
          <button className="upgrade-btn" onClick={() => navigate("/#pricing")}>Ver planes →</button>
        </div>

        {/* ACTIONS */}
        <div className="res-actions">
          <button className="res-btn" onClick={() => navigate("/test")}>
            Hacer otro test
          </button>
          <button className="res-btn-outline" onClick={() => navigate("/ejercicios")}>
            Ver ejercicios →
            </button>
            <button className="res-btn-outline" onClick={() => navigate("/dashboard")}>
              Mi progreso →
            </button>
            <button className="res-btn-outline" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
