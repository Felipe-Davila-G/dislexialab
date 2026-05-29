import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600&family=DM+Sans:wght@300;400;500&display=swap');
.ej-wrap{font-family:'DM Sans',sans-serif;min-height:100vh;background:#FAFAF7;color:#1C1917;}
.ej-nav{display:flex;align-items:center;justify-content:space-between;padding:0 clamp(16px,4vw,60px);height:60px;border-bottom:1px solid #EDE5D8;background:rgba(250,250,247,.95);backdrop-filter:blur(10px);position:sticky;top:0;z-index:50;}
.ej-logo{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:#1C1917;cursor:pointer;}
.ej-logo span{color:#2D6A4F;}
.ej-body{max-width:760px;margin:0 auto;padding:clamp(32px,5vw,56px) clamp(16px,4vw,40px);}
.ej-tag{display:inline-block;font-size:11px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:#2D6A4F;margin-bottom:10px;}
.ej-title{font-family:'Fraunces',serif;font-size:clamp(24px,4vw,34px);font-weight:500;color:#1C1917;margin-bottom:6px;}
.ej-sub{font-size:14px;color:#78716C;margin-bottom:32px;line-height:1.6;}

.ej-tabs{display:flex;gap:6px;margin-bottom:28px;flex-wrap:wrap;}
.ej-tab{padding:8px 18px;border-radius:40px;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;border:1.5px solid #EDE5D8;background:white;color:#78716C;transition:all .2s;}
.ej-tab.active{background:#1C1917;color:white;border-color:#1C1917;}
.ej-tab:hover:not(.active){border-color:#1C1917;color:#1C1917;}

.ej-card{background:white;border:1.5px solid #EDE5D8;border-radius:20px;padding:28px;margin-bottom:16px;}
.ej-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.ej-card-type{font-size:11px;font-weight:500;color:#2D6A4F;text-transform:uppercase;letter-spacing:.06em;}
.ej-card-pts{font-size:12px;color:#78716C;background:#F5F0E8;padding:3px 10px;border-radius:40px;}
.ej-prompt{font-family:'Fraunces',serif;font-size:clamp(16px,3vw,20px);font-weight:500;color:#1C1917;line-height:1.45;margin-bottom:20px;}

.ej-options{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
.ej-opt{padding:13px 16px;border:1.5px solid #EDE5D8;border-radius:12px;cursor:pointer;font-size:15px;font-family:'DM Sans',sans-serif;background:white;color:#1C1917;transition:all .15s;text-align:center;}
.ej-opt:hover:not(:disabled){border-color:#2D6A4F;background:#D8F3DC;color:#1B4332;}
.ej-opt.correct{border-color:#2D6A4F;background:#D8F3DC;color:#1B4332;font-weight:500;}
.ej-opt.wrong{border-color:#E76F51;background:#FDE8E1;color:#9B2C2C;}
.ej-opt:disabled{cursor:default;}
.ej-opt.mono{font-family:monospace;font-size:18px;letter-spacing:.08em;}

.ej-text-input{width:100%;padding:12px 16px;border-radius:12px;border:1.5px solid #EDE5D8;font-family:'DM Sans',sans-serif;font-size:16px;background:#FAFAF7;color:#1C1917;outline:none;transition:border-color .2s;margin-bottom:12px;}
.ej-text-input:focus{border-color:#2D6A4F;}
.ej-text-input.correct{border-color:#2D6A4F;background:#D8F3DC;}
.ej-text-input.wrong{border-color:#E76F51;background:#FDE8E1;}

.ej-seq{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;}
.ej-seq-item{width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;background:#F5F0E8;cursor:pointer;border:1.5px solid transparent;transition:all .2s;user-select:none;}
.ej-seq-item:hover{border-color:#2D6A4F;}
.ej-seq-item.selected{border-color:#2D6A4F;background:#D8F3DC;}
.ej-seq-item.correct{border-color:#2D6A4F;background:#D8F3DC;}
.ej-seq-item.wrong{border-color:#E76F51;background:#FDE8E1;}

.ej-feedback{display:flex;align-items:flex-start;gap:8px;padding:10px 14px;border-radius:10px;font-size:13px;line-height:1.5;margin-bottom:12px;}
.ej-fb-correct{background:#D8F3DC;color:#1B4332;}
.ej-fb-wrong{background:#FDE8E1;color:#9B2C2C;}

.ej-audio-btn{display:flex;align-items:center;gap:8px;background:#EEF2FF;color:#3730A3;border:none;padding:8px 16px;border-radius:40px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;margin-bottom:16px;transition:background .2s;}
.ej-audio-btn:hover{background:#C7D2FE;}
.ej-audio-btn.playing{background:#C7D2FE;}

.ej-btn{background:#1C1917;color:#FAFAF7;border:none;padding:12px 28px;border-radius:40px;font-size:14px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:background .2s,transform .15s;}
.ej-btn:hover{background:#2D6A4F;transform:translateY(-1px);}
.ej-btn-outline{background:transparent;color:#1C1917;border:1.5px solid #EDE5D8;padding:12px 24px;border-radius:40px;font-size:14px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;margin-right:10px;}
.ej-btn-outline:hover{border-color:#1C1917;}

.ej-score-bar{background:#F5F0E8;border-radius:12px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:10px;}
.ej-score-label{font-size:13px;color:#78716C;}
.ej-score-val{font-family:'Fraunces',serif;font-size:20px;font-weight:500;color:#1C1917;}
.ej-progress-mini{background:#EDE5D8;border-radius:40px;height:4px;width:120px;}
.ej-progress-fill{height:4px;border-radius:40px;background:#2D6A4F;transition:width .4s;}

.ej-complete{text-align:center;padding:48px 24px;background:white;border:1.5px solid #D8F3DC;border-radius:20px;}
.ej-complete-icon{font-size:48px;margin-bottom:12px;}
.ej-complete h3{font-family:'Fraunces',serif;font-size:22px;font-weight:500;color:#1C1917;margin-bottom:8px;}
.ej-complete p{font-size:14px;color:#78716C;margin-bottom:24px;}
.ej-btn-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}
`;

// ── EJERCICIOS ───────────────────────────────────────────────────────────────
const ejerciciosPorTipo = {
  letras: [
    { tipo:"Discriminación de letras", prompt:"Selecciona todas las letras 'b' (no 'd', 'p' o 'q')", kind:"select-all", items:["b","d","b","p","b","q","b","d","p","b"], correct:[0,2,4,6,9], explanation:"La letra 'b' tiene el palo a la izquierda. La 'd' lo tiene a la derecha." },
    { tipo:"Discriminación de letras", prompt:"¿Cuál de estas palabras está escrita correctamente?", kind:"opciones", options:["vivir","vibir","uiuir","viuir"], correct:0, explanation:"'Vivir' se escribe con dos 'v'. La confusión b/v es común en dislexia." },
    { tipo:"Discriminación de letras", prompt:"Escribe la palabra que ves: 'doma'", kind:"texto", answer:"doma", explanation:"¿Escribiste 'boma' o 'doma'? La d minúscula tiene la curva a la izquierda.", audio:"Escribe la palabra: doma" },
    { tipo:"Discriminación de letras", prompt:"¿Cuál par de letras son IGUALES?", kind:"opciones", options:["b — d","p — q","m — m","n — u"], correct:2, explanation:"'m — m' son iguales. Las otras son pares que frecuentemente se confunden en dislexia." },
    { tipo:"Discriminación de letras", prompt:"Selecciona todas las letras 'p' (no 'q', 'b' o 'd')", kind:"select-all", items:["p","q","p","b","d","p","q","p","b","p"], correct:[0,2,5,7,9], explanation:"La 'p' tiene el palo hacia abajo y la curva a la derecha." },
  ],
  lectura: [
    { tipo:"Lectura y comprensión", prompt:"Lee: 'María fue al mercado y compró manzanas rojas y peras verdes.' ¿Qué compró María?", kind:"opciones", options:["Naranjas y uvas","Manzanas y peras","Solo manzanas","Peras y duraznos"], correct:1, explanation:"El texto dice claramente: manzanas rojas y peras verdes.", audio:"María fue al mercado y compró manzanas rojas y peras verdes. ¿Qué compró María?" },
    { tipo:"Lectura y comprensión", prompt:"Lee despacio: 'El tren sale a las tres de la tarde del lunes.' ¿Cuándo sale el tren?", kind:"opciones", options:["Martes en la mañana","Lunes a las tres","Viernes a las tres","Domingo al mediodía"], correct:1, explanation:"'Lunes a las tres de la tarde' — importante leer todos los detalles juntos.", audio:"El tren sale a las tres de la tarde del lunes. ¿Cuándo sale el tren?" },
    { tipo:"Lectura y comprensión", prompt:"Completa la palabra: 'El ni_o juega en el parque'", kind:"texto", answer:"ñ", placeholder:"Escribe la letra que falta", explanation:"La letra 'ñ' es única del español. La palabra completa es 'niño'." },
    { tipo:"Lectura y comprensión", prompt:"Lee: 'La dislexia no afecta la inteligencia, solo la forma en que el cerebro procesa el lenguaje.' ¿Qué NO afecta la dislexia?", kind:"opciones", options:["El lenguaje","La lectura","La inteligencia","La escritura"], correct:2, explanation:"La dislexia afecta el procesamiento del lenguaje, pero no la inteligencia.", audio:"La dislexia no afecta la inteligencia, solo la forma en que el cerebro procesa el lenguaje." },
    { tipo:"Lectura y comprensión", prompt:"Ordena las palabras para formar una oración: [parque / en / juega / la / niña / el]", kind:"opciones", options:["La niña juega en el parque","El parque juega la niña en","Juega la en niña parque el","En el niña la parque juega"], correct:0, explanation:"La oración correcta sigue el orden: sujeto + verbo + complemento." },
  ],
  memoria: [
    { tipo:"Memoria y secuencias", prompt:"Memoriza la secuencia y selecciona el orden correcto: 🌟 🎈 🌈 🦋", kind:"opciones", options:["🎈 🌟 🌈 🦋","🌟 🎈 🦋 🌈","🌟 🎈 🌈 🦋","🌈 🦋 🌟 🎈"], correct:2, explanation:"El orden era: estrella, globo, arcoíris, mariposa.", audio:"Memoriza: estrella, globo, arcoíris, mariposa. ¿Cuál es el orden correcto?" },
    { tipo:"Memoria y secuencias", prompt:"Completa la secuencia: 🔴 🔵 🔴 🔵 ___", kind:"opciones", options:["🟡","🔵","🔴","🟢"], correct:2, explanation:"El patrón es rojo-azul alternado, por lo que sigue un 🔴 rojo." },
    { tipo:"Memoria y secuencias", prompt:"Escucha y escribe los números en orden: 3, 7, 1, 9", kind:"texto", answer:"3719", placeholder:"Escribe los 4 números seguidos", explanation:"La secuencia era 3, 7, 1, 9. Ejercitar la memoria auditiva ayuda con la dislexia.", audio:"Memoriza estos números: 3, 7, 1, 9. Escríbelos en orden." },
    { tipo:"Memoria y secuencias", prompt:"¿Cuál es el mes que viene DESPUÉS de marzo?", kind:"opciones", options:["Febrero","Mayo","Abril","Junio"], correct:2, explanation:"El orden es: enero, febrero, marzo, ABRIL, mayo..." },
    { tipo:"Memoria y secuencias", prompt:"Completa: 'a, e, i, ___, u'", kind:"opciones", options:["b","o","p","c"], correct:1, explanation:"Las vocales en orden son: a, e, i, O, u." },
  ],
};

export default function Ejercicios() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState("letras");
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [selectedAll, setSelectedAll] = useState([]);
  const [textVal, setTextVal] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState({ letras:0, lectura:0, memoria:0 });
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    setIdx(0); setSelected(null); setSelectedAll([]);
    setTextVal(""); setSubmitted(false); setCorrect(null); setDone(false);
    window.speechSynthesis?.cancel();
  }, [tab]);

  const ejercicios = ejerciciosPorTipo[tab];
  const ej = ejercicios[idx];
  const total = ejercicios.length;

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "es-ES"; utt.rate = 0.9;
    utt.onstart = () => setPlaying(true);
    utt.onend = () => setPlaying(false);
    window.speechSynthesis.speak(utt);
  };

  const submitOpciones = (i) => {
    if (submitted) return;
    setSelected(i);
    setSubmitted(true);
    const ok = i === ej.correct;
    setCorrect(ok);
    if (ok) setScore(s => ({...s, [tab]: s[tab]+1}));
  };

  const submitSelectAll = () => {
    if (submitted) return;
    setSubmitted(true);
    const ok = JSON.stringify([...selectedAll].sort()) === JSON.stringify([...ej.correct].sort());
    setCorrect(ok);
    if (ok) setScore(s => ({...s, [tab]: s[tab]+1}));
  };

  const submitTexto = () => {
    if (submitted) return;
    setSubmitted(true);
    const ok = textVal.trim().toLowerCase() === ej.answer.toLowerCase();
    setCorrect(ok);
    if (ok) setScore(s => ({...s, [tab]: s[tab]+1}));
  };

  const toggleSelectAll = (i) => {
    if (submitted) return;
    setSelectedAll(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev, i]);
  };

  const next = () => {
    window.speechSynthesis?.cancel();
    setPlaying(false);
    if (idx+1 >= total) { setDone(true); return; }
    setIdx(i=>i+1);
    setSelected(null); setSelectedAll([]); setTextVal("");
    setSubmitted(false); setCorrect(null);
  };

  const restart = () => {
    setIdx(0); setSelected(null); setSelectedAll([]);
    setTextVal(""); setSubmitted(false); setCorrect(null); setDone(false);
    setScore(s => ({...s, [tab]:0}));
  };

  const tabLabels = { letras:"🔤 Letras", lectura:"📖 Lectura", memoria:"🧠 Memoria" };
  const progress = (idx/total)*100;

  return (
    <div className="ej-wrap">
      <nav className="ej-nav">
        <span className="ej-logo" onClick={() => navigate("/")}>DislexiaLab<span>.</span></span>
        <div style={{display:"flex",gap:10}}>
          {user && <button style={{background:"transparent",border:"1.5px solid #EDE5D8",padding:"7px 16px",borderRadius:"40px",fontSize:"13px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={() => navigate("/dashboard")}>← Dashboard</button>}
          <button style={{background:"#1C1917",color:"white",border:"none",padding:"9px 20px",borderRadius:"40px",fontSize:"13px",fontWeight:"500",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={() => navigate("/test")}>Nuevo test</button>
        </div>
      </nav>

      <div className="ej-body">
        <div className="ej-tag">Ejercicios de refuerzo</div>
        <div className="ej-title">Practica a tu ritmo</div>
        <div className="ej-sub">Ejercicios diseñados para reforzar las áreas más afectadas por la dislexia. Puedes repetirlos las veces que quieras.</div>

        <div className="ej-tabs">
          {Object.entries(tabLabels).map(([key,label]) => (
            <button key={key} className={`ej-tab${tab===key?" active":""}`} onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>

        {/* SCORE + PROGRESS */}
        <div className="ej-score-bar">
          <div>
            <div className="ej-score-label">Ejercicio {done?total:idx+1} de {total}</div>
            <div className="ej-score-val">✓ {score[tab]} correctos</div>
          </div>
          <div>
            <div className="ej-score-label" style={{marginBottom:"4px"}}>Progreso</div>
            <div className="ej-progress-mini"><div className="ej-progress-fill" style={{width:`${done?100:progress}%`}}/></div>
          </div>
        </div>

        {done ? (
          <div className="ej-complete">
            <div className="ej-complete-icon">{score[tab]>=4?"🎉":score[tab]>=2?"👍":"💪"}</div>
            <h3>{score[tab]>=4?"¡Excelente trabajo!":score[tab]>=2?"¡Buen esfuerzo!":"¡Sigue practicando!"}</h3>
            <p>{score[tab]} de {total} correctos en {tabLabels[tab].split(" ")[1]}. {score[tab]<3?"Te recomendamos repetir este módulo para reforzar.":"¡Estás mejorando!"}</p>
            <div className="ej-btn-row">
              <button className="ej-btn-outline" onClick={restart}>Repetir módulo</button>
              <button className="ej-btn" onClick={() => { setTab(tab==="letras"?"lectura":tab==="lectura"?"memoria":"letras"); }}>Siguiente módulo →</button>
            </div>
          </div>
        ) : (
          <div className="ej-card">
            <div className="ej-card-header">
              <span className="ej-card-type">{ej.tipo}</span>
              <span className="ej-card-pts">+1 punto</span>
            </div>

            <div className="ej-prompt">{ej.prompt}</div>

            {ej.audio && (
              <button className={`ej-audio-btn${playing?" playing":""}`} onClick={() => speak(ej.audio)}>
                {playing?"🔊 Reproduciendo...":"🔊 Escuchar"}
              </button>
            )}

            {/* OPCIONES */}
            {ej.kind === "opciones" && (
              <div className="ej-options">
                {ej.options.map((opt, i) => {
                  let cls = "ej-opt";
                  if (ej.tipo==="Discriminación de letras") cls += " mono";
                  if (submitted) {
                    if (i===ej.correct) cls += " correct";
                    else if (i===selected) cls += " wrong";
                  }
                  return <button key={i} className={cls} onClick={() => submitOpciones(i)} disabled={submitted}>{opt}</button>;
                })}
              </div>
            )}

            {/* SELECT ALL */}
            {ej.kind === "select-all" && (
              <>
                <div className="ej-seq">
                  {ej.items.map((item, i) => {
                    let cls = "ej-seq-item";
                    if (submitted) {
                      if (ej.correct.includes(i)) cls += " correct";
                      else if (selectedAll.includes(i)) cls += " wrong";
                    } else if (selectedAll.includes(i)) cls += " selected";
                    return <div key={i} className={cls} onClick={() => toggleSelectAll(i)}>{item}</div>;
                  })}
                </div>
                {!submitted && <button className="ej-btn" onClick={submitSelectAll}>Verificar selección</button>}
              </>
            )}

            {/* TEXTO */}
            {ej.kind === "texto" && (
              <>
                <input
                  className={`ej-text-input${submitted?(correct?" correct":" wrong"):""}`}
                  placeholder={ej.placeholder||"Escribe tu respuesta..."}
                  value={textVal}
                  onChange={e => setTextVal(e.target.value)}
                  disabled={submitted}
                  onKeyDown={e => e.key==="Enter" && !submitted && submitTexto()}
                />
                {!submitted && <button className="ej-btn" onClick={submitTexto} style={{marginTop:"4px"}}>Verificar</button>}
              </>
            )}

            {/* FEEDBACK */}
            {submitted && (
              <>
                <div className={`ej-feedback ${correct?"ej-fb-correct":"ej-fb-wrong"}`}>
                  {correct?"✓ ¡Correcto! ":"✗ No exactamente. "}{ej.explanation}
                </div>
                <button className="ej-btn" style={{width:"100%",marginTop:"4px"}} onClick={next}>
                  {idx+1>=total?"Ver resultado →":"Siguiente →"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
