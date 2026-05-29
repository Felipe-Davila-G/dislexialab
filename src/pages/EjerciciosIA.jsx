import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600&family=DM+Sans:wght@300;400;500&display=swap');
.eia-wrap{font-family:'DM Sans',sans-serif;min-height:100vh;background:#FAFAF7;color:#1C1917;}
.eia-nav{display:flex;align-items:center;justify-content:space-between;padding:0 clamp(16px,4vw,60px);height:60px;border-bottom:1px solid #EDE5D8;background:rgba(250,250,247,.95);backdrop-filter:blur(10px);position:sticky;top:0;z-index:50;}
.eia-logo{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:#1C1917;cursor:pointer;}
.eia-logo span{color:#2D6A4F;}
.eia-body{max-width:680px;margin:0 auto;padding:clamp(32px,5vw,56px) clamp(16px,4vw,40px);}
.eia-tag{font-size:11px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:#2D6A4F;margin-bottom:10px;display:block;}
.eia-title{font-family:'Fraunces',serif;font-size:clamp(22px,4vw,32px);font-weight:500;color:#1C1917;margin-bottom:6px;}
.eia-sub{font-size:14px;color:#78716C;margin-bottom:28px;line-height:1.6;}

.eia-areas{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:28px;}
.eia-area{border-radius:12px;padding:14px 16px;}
.eia-area-name{font-size:12px;margin-bottom:3px;}
.eia-area-score{font-family:'Fraunces',serif;font-size:22px;font-weight:500;}
.eia-area-bar{height:4px;border-radius:4px;margin-top:6px;}
.eia-area-track{background:#EDE5D8;border-radius:4px;margin-top:6px;height:4px;}

.eia-loading{text-align:center;padding:48px 24px;background:white;border:1.5px solid #EDE5D8;border-radius:20px;}
.eia-spinner{width:36px;height:36px;border:3px solid #EDE5D8;border-top-color:#2D6A4F;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 16px;}
@keyframes spin{to{transform:rotate(360deg)}}
.eia-loading h3{font-family:'Fraunces',serif;font-size:18px;font-weight:500;margin-bottom:6px;}
.eia-loading p{font-size:13px;color:#78716C;}

.eia-progress{background:#F5F0E8;border-radius:10px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;}
.eia-progress span{font-size:13px;color:#78716C;}
.eia-progress strong{font-family:'Fraunces',serif;font-size:18px;color:#2D6A4F;}
.eia-prog-track{background:#EDE5D8;border-radius:40px;height:5px;margin-bottom:20px;}
.eia-prog-fill{height:5px;border-radius:40px;background:#2D6A4F;transition:width .4s;}

.eia-card{background:white;border:1.5px solid #EDE5D8;border-radius:20px;padding:28px;margin-bottom:16px;}
.eia-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.eia-card-type{font-size:11px;font-weight:500;color:#2D6A4F;text-transform:uppercase;letter-spacing:.06em;}
.eia-card-num{font-size:12px;color:#78716C;background:#F5F0E8;padding:3px 10px;border-radius:40px;}
.eia-prompt{font-family:'Fraunces',serif;font-size:clamp(16px,2.5vw,20px);font-weight:500;color:#1C1917;line-height:1.45;margin-bottom:20px;}
.eia-opts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;}
.eia-opt{padding:12px 14px;border:1.5px solid #EDE5D8;border-radius:10px;cursor:pointer;font-size:14px;font-family:'DM Sans',sans-serif;background:white;color:#1C1917;transition:all .15s;text-align:center;}
.eia-opt:hover:not(:disabled){border-color:#2D6A4F;background:#D8F3DC;color:#1B4332;}
.eia-opt.correct{border-color:#2D6A4F;background:#D8F3DC;color:#1B4332;font-weight:500;}
.eia-opt.wrong{border-color:#E76F51;background:#FDE8E1;color:#9B2C2C;}
.eia-opt:disabled{cursor:default;}
.eia-text-in{width:100%;padding:11px 14px;border-radius:10px;border:1.5px solid #EDE5D8;font-family:'DM Sans',sans-serif;font-size:15px;background:#FAFAF7;color:#1C1917;outline:none;transition:border-color .2s;margin-bottom:10px;}
.eia-text-in:focus{border-color:#2D6A4F;}
.eia-text-in.ok{border-color:#2D6A4F;background:#D8F3DC;}
.eia-text-in.err{border-color:#E76F51;background:#FDE8E1;}
.eia-feedback{display:flex;gap:8px;padding:10px 14px;border-radius:8px;font-size:13px;line-height:1.5;margin-bottom:10px;}
.eia-fb-ok{background:#D8F3DC;color:#1B4332;}
.eia-fb-err{background:#FDE8E1;color:#9B2C2C;}
.eia-btn{background:#1C1917;color:#FAFAF7;border:none;padding:12px 28px;border-radius:40px;font-size:14px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:background .2s;}
.eia-btn:hover{background:#2D6A4F;}
.eia-btn-outline{background:transparent;color:#1C1917;border:1.5px solid #EDE5D8;padding:12px 24px;border-radius:40px;font-size:14px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;margin-right:10px;}
.eia-btn-outline:hover{border-color:#1C1917;}

.eia-complete{text-align:center;padding:48px 24px;background:white;border:1.5px solid #D8F3DC;border-radius:20px;}
.eia-complete-icon{font-size:48px;margin-bottom:12px;}
.eia-complete h3{font-family:'Fraunces',serif;font-size:22px;font-weight:500;margin-bottom:8px;}
.eia-complete p{font-size:14px;color:#78716C;margin-bottom:24px;line-height:1.6;}
.eia-btn-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}

.eia-error{text-align:center;padding:36px;background:white;border:1.5px solid #FEE2E2;border-radius:20px;}
.eia-error-icon{font-size:36px;margin-bottom:12px;}
.eia-error h3{font-family:'Fraunces',serif;font-size:18px;font-weight:500;margin-bottom:6px;}
.eia-error p{font-size:13px;color:#78716C;margin-bottom:20px;}

.eia-ai-badge{display:inline-flex;align-items:center;gap:6px;background:#F5F3FF;color:#5B21B6;font-size:12px;font-weight:500;padding:4px 12px;border-radius:40px;margin-bottom:20px;}
`;

const areaLabels = { fonologica:"Conciencia fonológica", letras:"Inversión de letras", secuencial:"Memoria secuencial", lectora:"Velocidad lectora" };
function areaColor(s){ return s>=75?"#2D6A4F":s>=45?"#D97706":"#DC2626"; }
function areaBg(s){ return s>=75?"#D8F3DC":s>=45?"#FEF3C7":"#FEE2E2"; }

// Ejercicios de respaldo por si Groq falla
const fallbackEjercicios = {
  fonologica: [
    {tipo:"Conciencia fonológica",prompt:"¿Cuántas sílabas tiene la palabra 'mariposa'?",kind:"opciones",options:["3","4","5","2"],correct:1,explanation:"Ma-ri-po-sa = 4 sílabas."},
    {tipo:"Conciencia fonológica",prompt:"¿Qué palabra rima con 'corazón'?",kind:"opciones",options:["Mesa","Canción","Perro","Casa"],correct:1,explanation:"Corazón y canción terminan con el mismo sonido '-ón'."},
  ],
  letras: [
    {tipo:"Inversión de letras",prompt:"¿Cuál de estas palabras está bien escrita?",kind:"opciones",options:["boda","doda","poda","qoda"],correct:0,explanation:"'boda' es la única escrita correctamente con 'b'."},
    {tipo:"Inversión de letras",prompt:"Escribe la letra que falta: 'pala_ra' (es una b o d)",kind:"texto",answer:"b",explanation:"La palabra correcta es 'palabra' con 'b'."},
  ],
  secuencial: [
    {tipo:"Memoria secuencial",prompt:"Completa: enero, febrero, ___, abril",kind:"opciones",options:["mayo","marzo","junio","agosto"],correct:1,explanation:"El tercer mes del año es marzo."},
    {tipo:"Memoria secuencial",prompt:"¿Cuál número sigue? 2, 4, 6, 8, ___",kind:"opciones",options:["9","11","10","12"],correct:2,explanation:"La secuencia aumenta de 2 en 2. Después del 8 viene el 10."},
  ],
  lectora: [
    {tipo:"Velocidad lectora",prompt:"Lee: 'El niño corre en el jardín'. ¿Dónde corre el niño?",kind:"opciones",options:["En la casa","En el parque","En el jardín","En la calle"],correct:2,explanation:"El texto dice claramente 'en el jardín'."},
    {tipo:"Velocidad lectora",prompt:"Lee: 'Ana tiene un perro llamado Fido'. ¿Cómo se llama el perro?",kind:"opciones",options:["Ana","Fido","Max","Rex"],correct:1,explanation:"El texto dice que el perro se llama Fido."},
  ],
};

export default function EjerciciosIA() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [textVal, setTextVal] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (!state?.areas) { navigate("/test"); return; }
    generateEjercicios();
  }, []);

  const generateEjercicios = async () => {
    const { areas, nombre, isKids } = state;

    // Identificar áreas débiles (menor a 75%)
    const weakAreas = Object.entries(areas)
      .filter(([, v]) => v < 75)
      .sort((a, b) => a[1] - b[1])
      .map(([k]) => k);

    if (!weakAreas.length) {
      // Todas las áreas están bien — ejercicios de mantenimiento
      const all = Object.values(fallbackEjercicios).flat().slice(0, 5);
      setEjercicios(all);
      setLoading(false);
      return;
    }

    const areaDesc = weakAreas.map(k => `${areaLabels[k]}: ${areas[k]}%`).join(", ");
    const nivel = isKids ? "niño de 6 a 12 años" : "adulto";
    const prompt = `Genera exactamente 6 ejercicios de refuerzo para dislexia personalizados para ${nombre}, un ${nivel}. 
Las áreas más débiles son: ${areaDesc}.
Enfócate principalmente en las áreas con menor puntaje.
Cada ejercicio debe ser claro, corto y apropiado para el nivel.
Responde SOLO con un array JSON con esta estructura exacta:
[
  {
    "tipo": "nombre del área",
    "prompt": "pregunta o instrucción clara",
    "kind": "opciones",
    "options": ["opción A", "opción B", "opción C", "opción D"],
    "correct": 0,
    "explanation": "explicación breve de la respuesta correcta"
  }
]
Para ejercicios de escritura usa kind "texto" con campo "answer" en lugar de options/correct.`;

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, format: "ejercicios" }),
      });
      const data = await res.json();

      if (data.ejercicios?.length > 0) {
        setEjercicios(data.ejercicios);
      } else {
        // Fallback: usar ejercicios del área más débil
        useFallback(weakAreas);
      }
    } catch (err) {
      console.error(err);
      useFallback(weakAreas);
    }
    setLoading(false);
  };

  const useFallback = (weakAreas) => {
    let ejs = [];
    weakAreas.forEach(area => {
      if (fallbackEjercicios[area]) ejs = [...ejs, ...fallbackEjercicios[area]];
    });
    if (!ejs.length) ejs = Object.values(fallbackEjercicios).flat();
    setEjercicios(ejs.slice(0, 6));
  };

  const ej = ejercicios[idx];
  const total = ejercicios.length;
  const progress = total ? (idx / total) * 100 : 0;

  const submitOpciones = (i) => {
    if (submitted) return;
    setSelected(i);
    setSubmitted(true);
    const ok = i === ej.correct;
    setCorrect(ok);
    if (ok) setScore(s => s + 1);
  };

  const submitTexto = () => {
    if (submitted) return;
    setSubmitted(true);
    const ok = textVal.trim().toLowerCase() === (ej.answer || "").toLowerCase();
    setCorrect(ok);
    if (ok) setScore(s => s + 1);
  };

  const next = () => {
    if (idx + 1 >= total) { setDone(true); return; }
    setIdx(i => i + 1);
    setSelected(null);
    setTextVal("");
    setSubmitted(false);
    setCorrect(null);
  };

  const { areas, nombre } = state || {};

  return (
    <div className="eia-wrap">
      <nav className="eia-nav">
        <span className="eia-logo" onClick={() => navigate("/")}>DislexiaLab<span>.</span></span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="eia-btn-outline" style={{ padding: "7px 16px", fontSize: "13px" }} onClick={() => navigate("/perfil")}>← Mi perfil</button>
          <button className="eia-btn" style={{ padding: "7px 16px", fontSize: "13px" }} onClick={() => navigate("/test")}>Nuevo test</button>
        </div>
      </nav>

      <div className="eia-body">
        <span className="eia-tag">Ejercicios personalizados</span>
        <div className="eia-title">Plan de refuerzo para {nombre}</div>
        <div className="eia-sub">Ejercicios generados por IA según tus áreas más débiles en el test anterior.</div>

        <div className="eia-ai-badge">✦ Generado por IA · Personalizado para ti</div>

        {/* ÁREAS */}
        {areas && (
          <div className="eia-areas">
            {Object.entries(areas).map(([k, v]) => (
              <div className="eia-area" key={k} style={{ background: areaBg(v) }}>
                <div className="eia-area-name" style={{ color: areaColor(v), fontSize: "11px", fontWeight: "500" }}>{areaLabels[k]}</div>
                <div className="eia-area-score" style={{ color: areaColor(v) }}>{v}%</div>
                <div className="eia-area-track">
                  <div className="eia-area-bar" style={{ width: `${v}%`, background: areaColor(v) }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="eia-loading">
            <div className="eia-spinner" />
            <h3>Generando ejercicios...</h3>
            <p>La IA está creando ejercicios personalizados según tus áreas débiles.</p>
          </div>
        )}

        {/* EJERCICIOS */}
        {!loading && !done && ej && (
          <>
            <div className="eia-progress">
              <span>Ejercicio {idx + 1} de {total} · ✓ {score} correctos</span>
              <strong>{score}/{total}</strong>
            </div>
            <div className="eia-prog-track">
              <div className="eia-prog-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="eia-card">
              <div className="eia-card-header">
                <span className="eia-card-type">{ej.tipo}</span>
                <span className="eia-card-num">+1 punto</span>
              </div>
              <div className="eia-prompt">{ej.prompt}</div>

              {ej.kind === "opciones" && (
                <div className="eia-opts">
                  {(ej.options || []).map((opt, i) => {
                    let cls = "eia-opt";
                    if (submitted) {
                      if (i === ej.correct) cls += " correct";
                      else if (i === selected) cls += " wrong";
                    }
                    return <button key={i} className={cls} onClick={() => submitOpciones(i)} disabled={submitted}>{opt}</button>;
                  })}
                </div>
              )}

              {ej.kind === "texto" && (
                <>
                  <input
                    className={`eia-text-in${submitted ? (correct ? " ok" : " err") : ""}`}
                    placeholder="Escribe tu respuesta..."
                    value={textVal}
                    onChange={e => setTextVal(e.target.value)}
                    disabled={submitted}
                    onKeyDown={e => e.key === "Enter" && !submitted && submitTexto()}
                  />
                  {!submitted && <button className="eia-btn" onClick={submitTexto}>Verificar</button>}
                </>
              )}

              {submitted && (
                <>
                  <div className={`eia-feedback ${correct ? "eia-fb-ok" : "eia-fb-err"}`}>
                    {correct ? "✓ ¡Correcto! " : "✗ "}{ej.explanation}
                  </div>
                  <button className="eia-btn" style={{ width: "100%" }} onClick={next}>
                    {idx + 1 >= total ? "Ver resultado →" : "Siguiente →"}
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {/* COMPLETADO */}
        {done && (
          <div className="eia-complete">
            <div className="eia-complete-icon">{score >= total * 0.8 ? "🎉" : score >= total * 0.5 ? "👍" : "💪"}</div>
            <h3>{score >= total * 0.8 ? "¡Excelente trabajo!" : score >= total * 0.5 ? "¡Buen esfuerzo!" : "¡Sigue practicando!"}</h3>
            <p>{score} de {total} ejercicios correctos.{score < total * 0.6 ? " Te recomendamos repetir estos ejercicios mañana para reforzar." : " ¡Estás mejorando notablemente!"}</p>
            <div className="eia-btn-row">
              <button className="eia-btn-outline" onClick={() => { setIdx(0); setSelected(null); setTextVal(""); setSubmitted(false); setCorrect(null); setScore(0); setDone(false); }}>Repetir</button>
              <button className="eia-btn" onClick={() => navigate("/perfil")}>Ver mi perfil →</button>
              <button className="eia-btn" onClick={() => navigate("/test")}>Nuevo test →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}