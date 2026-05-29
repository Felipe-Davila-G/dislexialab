import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600&family=DM+Sans:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
.pf-wrap{font-family:'DM Sans',sans-serif;min-height:100vh;background:#FAFAF7;color:#1C1917;display:flex;}

/* SIDEBAR */
.pf-sidebar{width:240px;min-height:100vh;background:#1C1917;display:flex;flex-direction:column;position:fixed;top:0;left:0;z-index:100;padding:24px 0;}
.pf-sidebar-logo{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:#FAFAF7;padding:0 20px 24px;border-bottom:1px solid rgba(250,250,247,.08);cursor:pointer;}
.pf-sidebar-logo span{color:#74C69D;}
.pf-sidebar-nav{flex:1;padding:16px 12px;}
.pf-nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;font-size:14px;color:rgba(250,250,247,.6);transition:all .2s;margin-bottom:4px;}
.pf-nav-item:hover{background:rgba(250,250,247,.08);color:#FAFAF7;}
.pf-nav-item.active{background:rgba(116,198,157,.15);color:#74C69D;}
.pf-nav-icon{font-size:16px;width:20px;text-align:center;flex-shrink:0;}
.pf-nav-label{font-size:13px;font-weight:500;}
.pf-nav-section{font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(250,250,247,.3);padding:12px 12px 6px;}
.pf-sidebar-bottom{padding:16px 12px;border-top:1px solid rgba(250,250,247,.08);}
.pf-user-chip{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;}
.pf-user-avatar{width:32px;height:32px;border-radius:50%;background:#2D6A4F;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:500;color:white;flex-shrink:0;}
.pf-user-email{font-size:11px;color:rgba(250,250,247,.5);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px;}
.pf-signout{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:10px;cursor:pointer;font-size:13px;color:rgba(250,250,247,.4);transition:all .2s;margin-top:4px;}
.pf-signout:hover{color:#FAFAF7;background:rgba(250,250,247,.06);}

/* MAIN */
.pf-main{margin-left:240px;flex:1;min-height:100vh;}
.pf-topbar{height:56px;border-bottom:1px solid #EDE5D8;display:flex;align-items:center;justify-content:space-between;padding:0 32px;background:rgba(250,250,247,.95);backdrop-filter:blur(10px);position:sticky;top:0;z-index:50;}
.pf-topbar-title{font-family:'Fraunces',serif;font-size:18px;font-weight:500;color:#1C1917;}
.pf-topbar-right{display:flex;align-items:center;gap:10px;}
.pf-btn{background:#1C1917;color:#FAFAF7;border:none;padding:8px 18px;border-radius:40px;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:background .2s;}
.pf-btn:hover{background:#2D6A4F;}
.pf-btn-outline{background:transparent;color:#1C1917;border:1.5px solid #EDE5D8;padding:8px 18px;border-radius:40px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;}
.pf-btn-outline:hover{border-color:#1C1917;}
.pf-btn-green{background:#2D6A4F;color:white;border:none;padding:8px 18px;border-radius:40px;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:background .2s;}
.pf-btn-green:hover{background:#1B4332;}

.pf-content{padding:32px;}

/* CARDS */
.pf-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px;}
.pf-metric{background:white;border:1.5px solid #EDE5D8;border-radius:16px;padding:18px 20px;}
.pf-metric-lbl{font-size:12px;color:#78716C;margin-bottom:6px;}
.pf-metric-val{font-family:'Fraunces',serif;font-size:28px;font-weight:500;color:#1C1917;line-height:1;}
.pf-badge{display:inline-block;font-size:11px;padding:2px 8px;border-radius:20px;margin-top:6px;}
.bg-green{background:#D8F3DC;color:#1B4332;} .bg-amber{background:#FEF3C7;color:#78350F;} .bg-red{background:#FEE2E2;color:#7F1D1D;} .bg-gray{background:#F5F0E8;color:#78716C;}

.pf-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px;}
.pf-card{background:white;border:1.5px solid #EDE5D8;border-radius:16px;padding:22px;}
.pf-card-title{font-size:14px;font-weight:500;color:#1C1917;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;}
.pf-card-title span{font-size:12px;color:#78716C;font-weight:400;}

/* CHART */
.pf-chart{display:flex;align-items:flex-end;gap:8px;height:100px;}
.pf-bar-wrap{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;}
.pf-bar{border-radius:5px 5px 0 0;width:100%;min-height:3px;}
.pf-bar-lbl{font-size:9px;color:#78716C;text-align:center;}
.pf-bar-val{font-size:10px;font-weight:500;color:#1C1917;}

/* AREAS */
.pf-areas{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.pf-area{background:#FAFAF7;border-radius:10px;padding:12px 14px;}
.pf-area-name{font-size:11px;color:#78716C;margin-bottom:3px;}
.pf-area-score{font-family:'Fraunces',serif;font-size:20px;font-weight:500;margin-bottom:4px;}
.pf-area-track{background:#EDE5D8;border-radius:40px;height:4px;}
.pf-area-fill{height:4px;border-radius:40px;}
.c-ok{color:#2D6A4F;} .c-warn{color:#D97706;} .c-bad{color:#DC2626;}
.f-ok{background:#2D6A4F;} .f-warn{background:#D97706;} .f-bad{background:#DC2626;}

/* HISTORY */
.pf-history{display:flex;flex-direction:column;gap:8px;}
.pf-hist-row{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#FAFAF7;border-radius:10px;border:1px solid #EDE5D8;transition:border-color .15s;cursor:pointer;}
.pf-hist-row:hover{border-color:#2D6A4F;}
.pf-hist-left{display:flex;align-items:center;gap:10px;}
.pf-hist-av{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;flex-shrink:0;}
.pf-hist-name{font-size:13px;font-weight:500;color:#1C1917;}
.pf-hist-date{font-size:11px;color:#78716C;}
.pf-risk{font-size:11px;font-weight:500;padding:2px 8px;border-radius:20px;}
.r-bajo{background:#D8F3DC;color:#1B4332;} .r-moderado{background:#FEF3C7;color:#78350F;} .r-alto{background:#FEE2E2;color:#7F1D1D;}

/* EJERCICIOS */
.pf-ej-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;}
.pf-ej-card{background:white;border:1.5px solid #EDE5D8;border-radius:14px;padding:20px;cursor:pointer;transition:all .2s;}
.pf-ej-card:hover{border-color:#2D6A4F;transform:translateY(-2px);}
.pf-ej-card.active{border-color:#2D6A4F;background:#F0FDF4;}
.pf-ej-icon{font-size:28px;margin-bottom:10px;}
.pf-ej-title{font-size:14px;font-weight:500;color:#1C1917;margin-bottom:4px;}
.pf-ej-desc{font-size:12px;color:#78716C;line-height:1.5;}
.pf-ej-badge{font-size:11px;padding:2px 8px;border-radius:20px;margin-top:8px;display:inline-block;}

/* EJERCICIO ACTIVO */
.pf-ej-active{background:white;border:1.5px solid #EDE5D8;border-radius:16px;padding:24px;}
.pf-ej-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.pf-ej-type{font-size:11px;font-weight:500;color:#2D6A4F;text-transform:uppercase;letter-spacing:.06em;}
.pf-ej-progress{font-size:12px;color:#78716C;}
.pf-ej-prompt{font-family:'Fraunces',serif;font-size:clamp(15px,2.5vw,19px);font-weight:500;color:#1C1917;line-height:1.45;margin-bottom:18px;}
.pf-opts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;}
.pf-opt{padding:12px 14px;border:1.5px solid #EDE5D8;border-radius:10px;cursor:pointer;font-size:14px;font-family:'DM Sans',sans-serif;background:white;color:#1C1917;transition:all .15s;text-align:center;}
.pf-opt:hover:not(:disabled){border-color:#2D6A4F;background:#D8F3DC;color:#1B4332;}
.pf-opt.correct{border-color:#2D6A4F;background:#D8F3DC;color:#1B4332;font-weight:500;}
.pf-opt.wrong{border-color:#E76F51;background:#FDE8E1;color:#9B2C2C;}
.pf-opt.mono{font-family:monospace;font-size:16px;letter-spacing:.06em;}
.pf-opt:disabled{cursor:default;}
.pf-seq{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}
.pf-seq-item{width:44px;height:44px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;background:#F5F0E8;cursor:pointer;border:1.5px solid transparent;transition:all .2s;}
.pf-seq-item:hover{border-color:#2D6A4F;}
.pf-seq-item.sel{border-color:#2D6A4F;background:#D8F3DC;}
.pf-seq-item.correct{border-color:#2D6A4F;background:#D8F3DC;}
.pf-seq-item.wrong{border-color:#E76F51;background:#FDE8E1;}
.pf-text-in{width:100%;padding:11px 14px;border-radius:10px;border:1.5px solid #EDE5D8;font-family:'DM Sans',sans-serif;font-size:15px;background:#FAFAF7;color:#1C1917;outline:none;transition:border-color .2s;margin-bottom:10px;}
.pf-text-in:focus{border-color:#2D6A4F;}
.pf-text-in.ok{border-color:#2D6A4F;background:#D8F3DC;}
.pf-text-in.err{border-color:#E76F51;background:#FDE8E1;}
.pf-feedback{display:flex;gap:8px;padding:10px 14px;border-radius:8px;font-size:13px;line-height:1.5;margin-bottom:10px;}
.pf-fb-ok{background:#D8F3DC;color:#1B4332;}
.pf-fb-err{background:#FDE8E1;color:#9B2C2C;}
.pf-audio-btn{display:flex;align-items:center;gap:6px;background:#EEF2FF;color:#3730A3;border:none;padding:7px 14px;border-radius:40px;font-size:12px;font-family:'DM Sans',sans-serif;cursor:pointer;margin-bottom:14px;transition:background .2s;}
.pf-audio-btn:hover,.pf-audio-btn.playing{background:#C7D2FE;}
.pf-score-wrap{background:#F0FDF4;border-radius:10px;padding:12px 16px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;}
.pf-score-wrap span{font-size:13px;color:#166534;}
.pf-score-wrap strong{font-family:'Fraunces',serif;font-size:18px;color:#2D6A4F;}
.pf-prog-track{background:#EDE5D8;border-radius:40px;height:5px;margin-bottom:18px;}
.pf-prog-fill{height:5px;border-radius:40px;background:#2D6A4F;transition:width .4s;}
.pf-complete{text-align:center;padding:36px 20px;}
.pf-complete-icon{font-size:44px;margin-bottom:10px;}
.pf-complete h3{font-family:'Fraunces',serif;font-size:20px;font-weight:500;margin-bottom:6px;}
.pf-complete p{font-size:13px;color:#78716C;margin-bottom:20px;}

/* PDF MODAL */
.pf-modal{display:none;position:fixed;inset:0;background:rgba(28,25,23,.6);z-index:200;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);}
.pf-modal.open{display:flex;}
.pf-modal-box{background:#FAFAF7;border-radius:20px;padding:32px;max-width:480px;width:100%;animation:mIn .2s ease;}
@keyframes mIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
.pf-modal-box h3{font-family:'Fraunces',serif;font-size:22px;font-weight:500;margin-bottom:6px;}
.pf-modal-box p{font-size:14px;color:#78716C;margin-bottom:20px;line-height:1.6;}
.pf-pdf-preview{background:white;border:1.5px solid #EDE5D8;border-radius:12px;padding:20px;margin-bottom:20px;font-size:13px;line-height:1.8;color:#44403C;}
.pf-pdf-preview h4{font-family:'Fraunces',serif;font-size:16px;margin-bottom:10px;color:#1C1917;}
.pf-pdf-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #F5F0E8;}
.pf-modal-btns{display:flex;gap:10px;}

.pf-empty{text-align:center;padding:48px 24px;background:white;border:1.5px solid #EDE5D8;border-radius:16px;}
.pf-empty-icon{font-size:40px;margin-bottom:12px;}
.pf-empty h3{font-family:'Fraunces',serif;font-size:18px;font-weight:500;margin-bottom:6px;}
.pf-empty p{font-size:14px;color:#78716C;margin-bottom:20px;}
.pf-spinner{width:28px;height:28px;border:3px solid #EDE5D8;border-top-color:#2D6A4F;border-radius:50%;animation:spin .8s linear infinite;margin:40px auto;}
@keyframes spin{to{transform:rotate(360deg)}}

@media(max-width:768px){
  .pf-sidebar{transform:translateX(-100%);transition:transform .3s;}
  .pf-sidebar.open{transform:translateX(0);}
  .pf-main{margin-left:0;}
  .pf-metrics{grid-template-columns:1fr 1fr;}
  .pf-grid2{grid-template-columns:1fr;}
  .pf-ej-grid{grid-template-columns:1fr 1fr;}
}
`;

const areaLabels = { fonologica:"Fonológica", letras:"Inversión letras", secuencial:"Secuencial", lectora:"Velocidad lectora" };
const riskConfig = {
  bajo:{ pill:"r-bajo", label:"Riesgo bajo", icon:"🟢" },
  moderado:{ pill:"r-moderado", label:"Riesgo moderado", icon:"🟡" },
  alto:{ pill:"r-alto", label:"Riesgo alto", icon:"🔴" },
};
function sc(v){ return v>=75?"c-ok":v>=45?"c-warn":"c-bad"; }
function sf(v){ return v>=75?"f-ok":v>=45?"f-warn":"f-bad"; }
function bc(v){ return v>=75?"#2D6A4F":v>=45?"#D97706":"#DC2626"; }
function fmt(d){ return d?new Date(d).toLocaleDateString("es-CO",{day:"numeric",month:"short",year:"numeric"}):"—"; }

// ── EJERCICIOS DATA ──────────────────────────────────────────────────────────
const ejData = {
  letras:[
    {tipo:"Discriminación de letras",prompt:"Selecciona todas las letras 'b' (no d, p, q)",kind:"select-all",items:["b","d","b","p","b","q","b","d","p","b"],correct:[0,2,4,6,9],exp:"La 'b' tiene el palo a la izquierda. La 'd' lo tiene a la derecha."},
    {tipo:"Discriminación de letras",prompt:"¿Cuál palabra está escrita correctamente?",kind:"opciones",options:["vivir","vibir","uiuir","viuir"],correct:0,exp:"'Vivir' se escribe con dos 'v'."},
    {tipo:"Discriminación de letras",prompt:"Escribe la palabra: 'doma'",kind:"texto",answer:"doma",exp:"¿Escribiste 'boma' o 'doma'? La d tiene la curva a la izquierda.",audio:"Escribe la palabra: doma"},
    {tipo:"Discriminación de letras",prompt:"¿Cuál par de letras son IGUALES?",kind:"opciones",options:["b — d","p — q","m — m","n — u"],correct:2,exp:"'m — m' son iguales. Los otros pares suelen confundirse en dislexia."},
    {tipo:"Discriminación de letras",prompt:"¿Cuál de estas es la letra 'q'?",kind:"opciones",options:["p","b","q","d"],correct:2,exp:"La 'q' tiene el palo hacia abajo a la derecha.",mono:true},
  ],
  lectura:[
    {tipo:"Lectura y comprensión",prompt:"Lee: 'María fue al mercado y compró manzanas rojas y peras verdes.' ¿Qué compró?",kind:"opciones",options:["Naranjas y uvas","Manzanas y peras","Solo manzanas","Peras y duraznos"],correct:1,exp:"El texto dice: manzanas rojas y peras verdes.",audio:"María fue al mercado y compró manzanas rojas y peras verdes."},
    {tipo:"Lectura y comprensión",prompt:"Lee: 'El tren sale a las tres de la tarde del lunes.' ¿Cuándo sale?",kind:"opciones",options:["Martes mañana","Lunes a las tres","Viernes a las tres","Domingo"],correct:1,exp:"Lunes a las tres de la tarde.",audio:"El tren sale a las tres de la tarde del lunes."},
    {tipo:"Lectura y comprensión",prompt:"Completa: 'El ni_o juega en el parque' — escribe la letra que falta",kind:"texto",answer:"ñ",placeholder:"Escribe la letra",exp:"La letra 'ñ' es única del español. La palabra es 'niño'."},
    {tipo:"Lectura y comprensión",prompt:"¿Qué NO afecta la dislexia según la ciencia?",kind:"opciones",options:["La lectura","La escritura","La inteligencia","La ortografía"],correct:2,exp:"La dislexia afecta el procesamiento del lenguaje, no la inteligencia."},
    {tipo:"Lectura y comprensión",prompt:"Ordena: [parque / en / juega / la / niña / el]",kind:"opciones",options:["La niña juega en el parque","El parque juega la niña","Juega la en niña parque","En el niña parque juega"],correct:0,exp:"Orden correcto: sujeto + verbo + complemento."},
  ],
  memoria:[
    {tipo:"Memoria y secuencias",prompt:"Memoriza: 🌟 🎈 🌈 🦋 — ¿Cuál es el orden correcto?",kind:"opciones",options:["🎈 🌟 🌈 🦋","🌟 🎈 🦋 🌈","🌟 🎈 🌈 🦋","🌈 🦋 🌟 🎈"],correct:2,exp:"El orden era: estrella, globo, arcoíris, mariposa.",audio:"Memoriza: estrella, globo, arcoíris, mariposa."},
    {tipo:"Memoria y secuencias",prompt:"Completa la secuencia: 🔴 🔵 🔴 🔵 ___",kind:"opciones",options:["🟡","🔵","🔴","🟢"],correct:2,exp:"Patrón rojo-azul alternado. Sigue un 🔴."},
    {tipo:"Memoria y secuencias",prompt:"Escribe los números en orden: 3, 7, 1, 9",kind:"texto",answer:"3719",placeholder:"Escribe los 4 números",exp:"La secuencia era 3, 7, 1, 9.",audio:"Memoriza: 3, 7, 1, 9."},
    {tipo:"Memoria y secuencias",prompt:"¿Qué mes viene DESPUÉS de marzo?",kind:"opciones",options:["Febrero","Mayo","Abril","Junio"],correct:2,exp:"Enero, febrero, marzo, ABRIL, mayo..."},
    {tipo:"Memoria y secuencias",prompt:"Completa: 'a, e, i, ___, u'",kind:"opciones",options:["b","o","p","c"],correct:1,exp:"Las vocales en orden: a, e, i, O, u."},
  ],
};

export default function Perfil() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [section, setSection] = useState("dashboard");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ejTab, setEjTab] = useState("letras");
  const [ejIdx, setEjIdx] = useState(0);
  const [ejSel, setEjSel] = useState(null);
  const [ejSelAll, setEjSelAll] = useState([]);
  const [ejText, setEjText] = useState("");
  const [ejSubmitted, setEjSubmitted] = useState(false);
  const [ejCorrect, setEjCorrect] = useState(null);
  const [ejScore, setEjScore] = useState({letras:0,lectura:0,memoria:0});
  const [ejDone, setEjDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchData();
  }, [user]);

  useEffect(() => {
    setEjIdx(0); setEjSel(null); setEjSelAll([]); setEjText("");
    setEjSubmitted(false); setEjCorrect(null); setEjDone(false);
    window.speechSynthesis?.cancel();
  }, [ejTab]);

  const fetchData = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    const { data: patients } = await supabase.from("patients").select("id,nombre,edad,created_at").eq("user_id", authUser.id);
    if (!patients?.length) { setLoading(false); return; }
    const ids = patients.map(p=>p.id);
    const { data: ts } = await supabase.from("test_sessions").select("id,patient_id,score,fecha").in("patient_id",ids).order("fecha",{ascending:false});
    const { data: reps } = await supabase.from("ai_reports").select("session_id,perfil_riesgo,areas,recomendaciones").in("session_id",(ts||[]).map(s=>s.id));
    const combined = (ts||[]).map(s=>({
      ...s,
      patient: patients.find(p=>p.id===s.patient_id),
      report: (reps||[]).find(r=>r.session_id===s.id),
    }));
    setSessions(combined);
    setLoading(false);
  };

  // Métricas
  const total = sessions.length;
  const avgScore = total ? Math.round(sessions.reduce((a,s)=>a+(s.score||0),0)/total) : 0;
  const lastS = sessions[0];
  const lastRisk = lastS?.report?.perfil_riesgo||"—";
  const areaAvgs = {fonologica:0,letras:0,secuencial:0,lectora:0};
  if(total){ sessions.forEach(s=>{ if(s.report?.areas) Object.keys(areaAvgs).forEach(k=>{ areaAvgs[k]+=(s.report.areas[k]||0); }); }); Object.keys(areaAvgs).forEach(k=>{ areaAvgs[k]=Math.round(areaAvgs[k]/total); }); }
  const chartData = [...sessions].reverse().slice(-6);
  const weakArea = Object.entries(areaAvgs).sort((a,b)=>a[1]-b[1])[0]?.[0];

  // Ejercicios
  const ejs = ejData[ejTab];
  const ej = ejs[ejIdx];
  const speak = (text) => {
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang="es-ES"; u.rate=0.9;
    u.onstart=()=>setPlaying(true); u.onend=()=>setPlaying(false);
    window.speechSynthesis.speak(u);
  };
  const submitOpt = (i) => {
    if(ejSubmitted) return;
    setEjSel(i); setEjSubmitted(true);
    const ok = i===ej.correct; setEjCorrect(ok);
    if(ok) setEjScore(s=>({...s,[ejTab]:s[ejTab]+1}));
  };
  const submitAll = () => {
    if(ejSubmitted) return; setEjSubmitted(true);
    const ok = JSON.stringify([...ejSelAll].sort())===JSON.stringify([...ej.correct].sort());
    setEjCorrect(ok); if(ok) setEjScore(s=>({...s,[ejTab]:s[ejTab]+1}));
  };
  const submitTxt = () => {
    if(ejSubmitted) return; setEjSubmitted(true);
    const ok = ejText.trim().toLowerCase()===ej.answer.toLowerCase();
    setEjCorrect(ok); if(ok) setEjScore(s=>({...s,[ejTab]:s[ejTab]+1}));
  };
  const ejNext = () => {
    window.speechSynthesis?.cancel(); setPlaying(false);
    if(ejIdx+1>=ejs.length){ setEjDone(true); return; }
    setEjIdx(i=>i+1); setEjSel(null); setEjSelAll([]); setEjText(""); setEjSubmitted(false); setEjCorrect(null);
  };
  const ejRestart = () => { setEjIdx(0); setEjSel(null); setEjSelAll([]); setEjText(""); setEjSubmitted(false); setEjCorrect(null); setEjDone(false); setEjScore(s=>({...s,[ejTab]:0})); };

  // PDF
  const generatePDF = (s) => { setSelectedSession(s); setPdfModal(true); };
  const printPDF = () => {
    const content = document.getElementById("pdf-content");
    const w = window.open("","_blank");
    w.document.write(`<html><head><title>Reporte DislexiaLab</title><style>body{font-family:sans-serif;padding:32px;color:#1C1917;} h1{font-size:22px;margin-bottom:4px;} p{color:#78716C;font-size:14px;margin-bottom:20px;} .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:14px;} .area{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:16px 0;} .area-card{background:#f5f5f3;border-radius:8px;padding:12px;} .area-name{font-size:12px;color:#78716C;} .area-val{font-size:20px;font-weight:bold;} .ai{background:#f0fdf4;border-radius:8px;padding:16px;margin-top:16px;font-size:14px;line-height:1.7;color:#166534;} .badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:bold;} .bajo{background:#D8F3DC;color:#1B4332;} .moderado{background:#FEF3C7;color:#78350F;} .alto{background:#FEE2E2;color:#7F1D1D;}</style></head><body>${content.innerHTML}</body></html>`);
    w.document.close(); w.print();
  };

  const navItems = [
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"historial", icon:"📋", label:"Historial" },
    { id:"ejercicios", icon:"🧩", label:"Ejercicios" },
    { id:"perfil", icon:"👤", label:"Mi perfil" },
  ];

  const sectionTitles = { dashboard:"Dashboard", historial:"Historial de tests", ejercicios:"Ejercicios de refuerzo", perfil:"Mi perfil" };

  return (
    <div className="pf-wrap">
      {/* SIDEBAR */}
      <aside className="pf-sidebar">
        <div className="pf-sidebar-logo" onClick={()=>navigate("/")}>DislexiaLab<span>.</span></div>
        <nav className="pf-sidebar-nav">
          <div className="pf-nav-section">Principal</div>
          {navItems.map(item=>(
            <div key={item.id} className={`pf-nav-item${section===item.id?" active":""}`} onClick={()=>setSection(item.id)}>
              <span className="pf-nav-icon">{item.icon}</span>
              <span className="pf-nav-label">{item.label}</span>
            </div>
          ))}
          <div className="pf-nav-section" style={{marginTop:"16px"}}>Acciones</div>
          <div className="pf-nav-item" onClick={()=>navigate("/test")}>
            <span className="pf-nav-icon">➕</span>
            <span className="pf-nav-label">Nuevo test</span>
          </div>
          <div className="pf-nav-item" onClick={()=>navigate("/")}>
            <span className="pf-nav-icon">🏠</span>
            <span className="pf-nav-label">Inicio</span>
          </div>
        </nav>
        <div className="pf-sidebar-bottom">
          <div className="pf-user-chip">
            <div className="pf-user-avatar">{user?.email?.[0]?.toUpperCase()||"U"}</div>
            <div className="pf-user-email">{user?.email}</div>
          </div>
          <div className="pf-signout" onClick={signOut}>⬅ Cerrar sesión</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="pf-main">
        <div className="pf-topbar">
          <div className="pf-topbar-title">{sectionTitles[section]}</div>
          <div className="pf-topbar-right">
            <button className="pf-btn-outline" onClick={()=>setSection("ejercicios")}>Ejercicios</button>
            <button className="pf-btn" onClick={()=>navigate("/test")}>+ Nuevo test</button>
          </div>
        </div>

        <div className="pf-content">

          {/* ── DASHBOARD ── */}
          {section==="dashboard" && (
            loading ? <div className="pf-spinner"/> :
            total===0 ? (
              <div className="pf-empty">
                <div className="pf-empty-icon">🧩</div>
                <h3>Aún no tienes evaluaciones</h3>
                <p>Realiza tu primer test para ver tu progreso aquí.</p>
                <button className="pf-btn" onClick={()=>navigate("/test")}>Hacer primer test →</button>
              </div>
            ) : (<>
              <div className="pf-metrics">
                <div className="pf-metric"><div className="pf-metric-lbl">Tests realizados</div><div className="pf-metric-val">{total}</div><span className="pf-badge bg-gray">histórico</span></div>
                <div className="pf-metric"><div className="pf-metric-lbl">Puntaje promedio</div><div className="pf-metric-val">{avgScore}%</div><span className={`pf-badge ${avgScore>=75?"bg-green":avgScore>=50?"bg-amber":"bg-red"}`}>{avgScore>=75?"Bueno":avgScore>=50?"Regular":"Bajo"}</span></div>
                <div className="pf-metric"><div className="pf-metric-lbl">Último resultado</div><div className="pf-metric-val">{lastS?.score||0}%</div><span className={`pf-badge ${riskConfig[lastRisk]?.pill?.replace("r-","bg-")||"bg-gray"}`}>{riskConfig[lastRisk]?.label||"—"}</span></div>
                <div className="pf-metric"><div className="pf-metric-lbl">Área más débil</div><div className="pf-metric-val" style={{fontSize:"16px",paddingTop:"6px"}}>{areaLabels[weakArea]||"—"}</div><span className="pf-badge bg-amber">reforzar</span></div>
              </div>
              <div className="pf-grid2">
                {chartData.length>1 && (
                  <div className="pf-card">
                    <div className="pf-card-title">Evolución del puntaje <span>últimos {chartData.length} tests</span></div>
                    <div className="pf-chart">
                      {chartData.map((s,i)=>(
                        <div className="pf-bar-wrap" key={i}>
                          <div className="pf-bar-val">{s.score}%</div>
                          <div className="pf-bar" style={{height:`${s.score}%`,background:bc(s.score)}}/>
                          <div className="pf-bar-lbl">{new Date(s.fecha).toLocaleDateString("es-CO",{day:"numeric",month:"short"})}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pf-card">
                  <div className="pf-card-title">Promedio por área</div>
                  <div className="pf-areas">
                    {Object.entries(areaAvgs).map(([k,v])=>(
                      <div className="pf-area" key={k}>
                        <div className="pf-area-name">{areaLabels[k]}</div>
                        <div className={`pf-area-score ${sc(v)}`}>{v}%</div>
                        <div className="pf-area-track"><div className={`pf-area-fill ${sf(v)}`} style={{width:`${v}%`}}/></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pf-card">
                <div className="pf-card-title">Últimos tests <span onClick={()=>setSection("historial")} style={{cursor:"pointer",color:"#2D6A4F"}}>Ver todos →</span></div>
                <div className="pf-history">
                  {sessions.slice(0,4).map((s,i)=>{
                    const r=riskConfig[s.report?.perfil_riesgo]||riskConfig.moderado;
                    const avColors=["#D8F3DC","#EEF2FF","#FEF3C7","#FDE8E1"];
                    const avText=["#1B4332","#3730A3","#78350F","#9B2C2C"];
                    return (
                      <div className="pf-hist-row" key={i} onClick={()=>generatePDF(s)}>
                        <div className="pf-hist-left">
                          <div className="pf-hist-av" style={{background:avColors[i%4],color:avText[i%4]}}>{s.patient?.nombre?.[0]?.toUpperCase()||"?"}</div>
                          <div><div className="pf-hist-name">{s.patient?.nombre||"Paciente"}</div><div className="pf-hist-date">{fmt(s.fecha)} · {s.score}%</div></div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                          <span className={`pf-risk ${r.pill}`}>{r.label}</span>
                          <span style={{fontSize:"11px",color:"#2D6A4F",cursor:"pointer"}}>📄 PDF</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>)
          )}

          {/* ── HISTORIAL ── */}
          {section==="historial" && (
            loading ? <div className="pf-spinner"/> :
            total===0 ? (
              <div className="pf-empty">
                <div className="pf-empty-icon">📋</div>
                <h3>Sin historial aún</h3>
                <p>Haz tu primer test para ver los resultados aquí.</p>
                <button className="pf-btn" onClick={()=>navigate("/test")}>Hacer test →</button>
              </div>
            ) : (
              <div className="pf-card">
                <div className="pf-card-title">Todos los tests ({total})</div>
                <div className="pf-history">
                  {sessions.map((s,i)=>{
                    const r=riskConfig[s.report?.perfil_riesgo]||riskConfig.moderado;
                    const avColors=["#D8F3DC","#EEF2FF","#FEF3C7","#FDE8E1"];
                    const avText=["#1B4332","#3730A3","#78350F","#9B2C2C"];
                    return (
                      <div className="pf-hist-row" key={i} onClick={()=>generatePDF(s)}>
                        <div className="pf-hist-left">
                          <div className="pf-hist-av" style={{background:avColors[i%4],color:avText[i%4]}}>{s.patient?.nombre?.[0]?.toUpperCase()||"?"}</div>
                          <div>
                            <div className="pf-hist-name">{s.patient?.nombre||"Paciente"}{s.patient?.edad?`, ${s.patient.edad} años`:""}</div>
                            <div className="pf-hist-date">{fmt(s.fecha)} · {s.score}% correctas</div>
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                          <span className={`pf-risk ${r.pill}`}>{r.label}</span>
                          <button onClick={e=>{e.stopPropagation();generatePDF(s);}} style={{background:"#F0FDF4",color:"#2D6A4F",border:"none",padding:"4px 10px",borderRadius:"20px",fontSize:"11px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>📄 Generar PDF</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}

          {/* ── EJERCICIOS ── */}
          {section==="ejercicios" && (<>
            <div style={{display:"flex",gap:"8px",marginBottom:"20px",flexWrap:"wrap"}}>
              {[["letras","🔤 Letras"],["lectura","📖 Lectura"],["memoria","🧠 Memoria"]].map(([k,l])=>(
                <button key={k} onClick={()=>setEjTab(k)} style={{padding:"8px 18px",borderRadius:"40px",fontSize:"13px",fontWeight:"500",fontFamily:"'DM Sans',sans-serif",cursor:"pointer",border:`1.5px solid ${ejTab===k?"#1C1917":"#EDE5D8"}`,background:ejTab===k?"#1C1917":"white",color:ejTab===k?"white":"#78716C",transition:"all .2s"}}>{l}</button>
              ))}
            </div>
            <div className="pf-score-wrap">
              <span>Ejercicio {ejDone?ejs.length:ejIdx+1} de {ejs.length} · ✓ {ejScore[ejTab]} correctos</span>
              <strong>{ejScore[ejTab]}/{ejs.length}</strong>
            </div>
            <div className="pf-prog-track"><div className="pf-prog-fill" style={{width:`${ejDone?100:(ejIdx/ejs.length)*100}%`}}/></div>
            {ejDone ? (
              <div className="pf-complete">
                <div className="pf-complete-icon">{ejScore[ejTab]>=4?"🎉":ejScore[ejTab]>=2?"👍":"💪"}</div>
                <h3>{ejScore[ejTab]>=4?"¡Excelente!":ejScore[ejTab]>=2?"¡Buen esfuerzo!":"¡Sigue practicando!"}</h3>
                <p>{ejScore[ejTab]} de {ejs.length} correctos. {ejScore[ejTab]<3?"Te recomendamos repetir este módulo.":"¡Estás mejorando!"}</p>
                <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
                  <button className="pf-btn-outline" onClick={ejRestart}>Repetir</button>
                  <button className="pf-btn" onClick={()=>setEjTab(ejTab==="letras"?"lectura":ejTab==="lectura"?"memoria":"letras")}>Siguiente módulo →</button>
                </div>
              </div>
            ) : (
              <div className="pf-ej-active">
                <div className="pf-ej-header">
                  <span className="pf-ej-type">{ej.tipo}</span>
                  <span className="pf-ej-progress">{ejIdx+1}/{ejs.length}</span>
                </div>
                <div className="pf-ej-prompt">{ej.prompt}</div>
                {ej.audio && <button className={`pf-audio-btn${playing?" playing":""}`} onClick={()=>speak(ej.audio)}>{playing?"🔊 Reproduciendo...":"🔊 Escuchar"}</button>}
                {ej.kind==="opciones" && (
                  <div className="pf-opts">
                    {ej.options.map((opt,i)=>{
                      let cls=`pf-opt${ej.mono?" mono":""}`;
                      if(ejSubmitted){ if(i===ej.correct) cls+=" correct"; else if(i===ejSel) cls+=" wrong"; }
                      return <button key={i} className={cls} onClick={()=>submitOpt(i)} disabled={ejSubmitted}>{opt}</button>;
                    })}
                  </div>
                )}
                {ej.kind==="select-all" && (<>
                  <div className="pf-seq">
                    {ej.items.map((item,i)=>{
                      let cls="pf-seq-item";
                      if(ejSubmitted){ if(ej.correct.includes(i)) cls+=" correct"; else if(ejSelAll.includes(i)) cls+=" wrong"; } else if(ejSelAll.includes(i)) cls+=" sel";
                      return <div key={i} className={cls} onClick={()=>{ if(!ejSubmitted) setEjSelAll(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]); }}>{item}</div>;
                    })}
                  </div>
                  {!ejSubmitted && <button className="pf-btn" onClick={submitAll}>Verificar</button>}
                </>)}
                {ej.kind==="texto" && (<>
                  <input className={`pf-text-in${ejSubmitted?(ejCorrect?" ok":" err"):""}`} placeholder={ej.placeholder||"Escribe tu respuesta..."} value={ejText} onChange={e=>setEjText(e.target.value)} disabled={ejSubmitted} onKeyDown={e=>e.key==="Enter"&&!ejSubmitted&&submitTxt()}/>
                  {!ejSubmitted && <button className="pf-btn" onClick={submitTxt}>Verificar</button>}
                </>)}
                {ejSubmitted && (<>
                  <div className={`pf-feedback ${ejCorrect?"pf-fb-ok":"pf-fb-err"}`}>{ejCorrect?"✓ ¡Correcto! ":"✗ "}{ej.exp}</div>
                  <button className="pf-btn" style={{width:"100%"}} onClick={ejNext}>{ejIdx+1>=ejs.length?"Ver resultado →":"Siguiente →"}</button>
                </>)}
              </div>
            )}
          </>)}

          {/* ── PERFIL ── */}
          {section==="perfil" && (
            <div className="pf-card" style={{maxWidth:"500px"}}>
              <div className="pf-card-title">Información de la cuenta</div>
              <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"24px",padding:"16px",background:"#F5F0E8",borderRadius:"12px"}}>
                <div style={{width:"52px",height:"52px",borderRadius:"50%",background:"#2D6A4F",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",fontWeight:"500",color:"white",flexShrink:0}}>{user?.email?.[0]?.toUpperCase()||"U"}</div>
                <div><div style={{fontSize:"15px",fontWeight:"500",color:"#1C1917"}}>{user?.email}</div><div style={{fontSize:"12px",color:"#78716C",marginTop:"2px"}}>Plan gratuito · {total} test{total!==1?"s":""} realizados</div></div>
              </div>
              <div style={{fontSize:"13px",color:"#78716C",marginBottom:"8px",fontWeight:"500"}}>Estadísticas</div>
              {[["Tests realizados",total],["Puntaje promedio",`${avgScore}%`],["Área más débil",areaLabels[weakArea]||"—"],["Último test",fmt(lastS?.fecha)]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #F5F0E8",fontSize:"14px"}}>
                  <span style={{color:"#78716C"}}>{l}</span><span style={{fontWeight:"500",color:"#1C1917"}}>{v}</span>
                </div>
              ))}
              <button className="pf-btn-outline" style={{marginTop:"20px",width:"100%"}} onClick={signOut}>Cerrar sesión</button>
            </div>
          )}

        </div>
      </main>

      {/* PDF MODAL */}
      <div className={`pf-modal${pdfModal?" open":""}`} onClick={e=>e.target.classList.contains("pf-modal")&&setPdfModal(false)}>
        <div className="pf-modal-box">
          <h3>Reporte PDF</h3>
          <p>Previsualiza y descarga el reporte de evaluación.</p>
          {selectedSession && (
            <div className="pf-pdf-preview" id="pdf-content">
              <h4>🧩 DislexiaLab — Reporte de evaluación</h4>
              <div className="pf-pdf-row"><span>Paciente</span><span>{selectedSession.patient?.nombre||"—"}</span></div>
              <div className="pf-pdf-row"><span>Edad</span><span>{selectedSession.patient?.edad||"—"} años</span></div>
              <div className="pf-pdf-row"><span>Fecha</span><span>{fmt(selectedSession.fecha)}</span></div>
              <div className="pf-pdf-row"><span>Puntaje</span><span>{selectedSession.score}%</span></div>
              <div className="pf-pdf-row"><span>Riesgo</span><span><span className={`badge ${selectedSession.report?.perfil_riesgo||"moderado"}`}>{riskConfig[selectedSession.report?.perfil_riesgo]?.label||"—"}</span></span></div>
              {selectedSession.report?.areas && (<>
                <div style={{marginTop:"12px",marginBottom:"4px",fontSize:"12px",color:"#78716C",fontWeight:"500"}}>ÁREAS</div>
                <div className="area">
                  {Object.entries(selectedSession.report.areas).map(([k,v])=>(
                    <div className="area-card" key={k}><div className="area-name">{areaLabels[k]}</div><div className="area-val">{v}%</div></div>
                  ))}
                </div>
              </>)}
              {selectedSession.report?.recomendaciones && (
                <div className="ai"><strong>✦ Análisis IA:</strong><br/>{selectedSession.report.recomendaciones}</div>
              )}
              <div style={{marginTop:"16px",fontSize:"11px",color:"#9CA3AF"}}>Generado por DislexiaLab · Este reporte es orientativo y no reemplaza un diagnóstico profesional.</div>
            </div>
          )}
          <div className="pf-modal-btns">
            <button className="pf-btn-outline" onClick={()=>setPdfModal(false)}>Cancelar</button>
            <button className="pf-btn-green" onClick={printPDF}>🖨 Imprimir / Guardar PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}
