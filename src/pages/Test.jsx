import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// ── PREGUNTAS NIÑOS (6-12) ──────────────────────────────────────────────────
const questionsKids = [
  // FONOLÓGICA
  {
    type: "Conciencia fonológica",
    text: "¿Cuál de estas palabras empieza con el sonido 'mmm'?",
    options: ["🍎 Manzana", "🐱 Gato", "🌸 Flor", "🐟 Pez"],
    correct: 0,
    audio: "¿Cuál de estas palabras empieza con el sonido mmm?",
  },
  {
    type: "Conciencia fonológica",
    text: "¿Qué palabra rima con 'sol'?",
    options: ["🌊 Mar", "⚽ Gol", "🌲 Árbol", "🐦 Pájaro"],
    correct: 1,
    audio: "¿Qué palabra rima con sol?",
  },
  {
    type: "Conciencia fonológica",
    text: "¿Cuántas sílabas tiene la palabra 'ca-sa'?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    audio: "¿Cuántas sílabas tiene la palabra casa?",
  },
  {
    type: "Conciencia fonológica",
    text: "¿Cuál de estas palabras termina con el sonido 'rrr'?",
    options: ["🐻 Oso", "🌙 Luna", "🐾 Tigre", "🌊 Mar"],
    correct: 3,
    audio: "¿Cuál de estas palabras termina con el sonido rrr?",
  },
  // INVERSIÓN LETRAS
  {
    type: "Inversión de letras",
    text: "¿Cuál de estas palabras está bien escrita?",
    options: ["bola", "dola", "pola", "qola"],
    correct: 0,
    audio: "¿Cuál de estas palabras está bien escrita?",
    highlight: true,
  },
  {
    type: "Inversión de letras",
    text: "¿Cuál letra es la 'b'?",
    options: ["d", "b", "p", "q"],
    correct: 1,
    audio: "¿Cuál letra es la b?",
    highlight: true,
  },
  {
    type: "Inversión de letras",
    text: "¿Cuál de estas palabras dice 'pato'?",
    options: ["dato", "pato", "bato", "qato"],
    correct: 1,
    audio: "¿Cuál de estas palabras dice pato?",
    highlight: true,
  },
  // MEMORIA SECUENCIAL
  {
    type: "Memoria secuencial",
    text: "Mira la secuencia: 🔴 🔵 🟡 🟢 — ¿Cuál viene después del 🔵?",
    options: ["🔴 Rojo", "🟡 Amarillo", "🟢 Verde", "🔵 Azul"],
    correct: 1,
    audio: "Mira la secuencia rojo, azul, amarillo, verde. ¿Cuál viene después del azul?",
  },
  {
    type: "Memoria secuencial",
    text: "¿Cuál es el orden correcto del abecedario?",
    options: ["c, b, a", "a, c, b", "a, b, c", "b, a, c"],
    correct: 2,
    audio: "¿Cuál es el orden correcto del abecedario?",
  },
  {
    type: "Memoria secuencial",
    text: "Escucha y recuerda: 🐶 🐱 🐭. ¿Cuál animal va primero?",
    options: ["🐱 Gato", "🐭 Ratón", "🐶 Perro", "🐟 Pez"],
    correct: 2,
    audio: "Recuerda esta secuencia: perro, gato, ratón. ¿Cuál animal va primero?",
  },
  // VELOCIDAD LECTORA
  {
    type: "Velocidad lectora",
    text: "Lee: 'El gato toma leche'. ¿Qué toma el gato?",
    options: ["Agua", "Jugo", "Leche", "Sopa"],
    correct: 2,
    audio: "El gato toma leche. ¿Qué toma el gato?",
  },
  {
    type: "Velocidad lectora",
    text: "Lee: 'La niña juega en el parque'. ¿Dónde juega la niña?",
    options: ["En casa", "En el parque", "En el colegio", "En la playa"],
    correct: 1,
    audio: "La niña juega en el parque. ¿Dónde juega la niña?",
  },
  {
    type: "Velocidad lectora",
    text: "Lee: 'El perro ladra fuerte'. ¿Qué hace el perro?",
    options: ["Duerme", "Come", "Ladra", "Corre"],
    correct: 2,
    audio: "El perro ladra fuerte. ¿Qué hace el perro?",
  },
];

// ── PREGUNTAS ADULTOS (13+) ─────────────────────────────────────────────────
const questionsAdults = [
  // FONOLÓGICA
  {
    type: "Conciencia fonológica",
    text: "¿Cuántas sílabas tiene la palabra 'extraordinario'?",
    options: ["4", "5", "6", "7"],
    correct: 2,
    audio: "¿Cuántas sílabas tiene la palabra extraordinario?",
  },
  {
    type: "Conciencia fonológica",
    text: "¿Cuál de estas palabras tiene el acento en la última sílaba?",
    options: ["Música", "Camión", "Árbol", "Cámara"],
    correct: 1,
    audio: "¿Cuál de estas palabras tiene el acento en la última sílaba?",
  },
  {
    type: "Conciencia fonológica",
    text: "¿Qué palabra rima con 'constitución'?",
    options: ["Camino", "Solución", "Práctica", "Número"],
    correct: 1,
    audio: "¿Qué palabra rima con constitución?",
  },
  {
    type: "Conciencia fonológica",
    text: "¿Cuál de estas palabras empieza con un sonido diferente a las demás?",
    options: ["Casa", "Cena", "Cigarro", "Cobra"],
    correct: 0,
    audio: "¿Cuál de estas palabras empieza con un sonido diferente a las demás?",
  },
  // INVERSIÓN LETRAS
  {
    type: "Inversión de letras",
    text: "¿Cuál de estas palabras está escrita correctamente?",
    options: ["Vivir", "Vibir", "Vivír", "Vibír"],
    correct: 0,
    audio: "¿Cuál de estas palabras está escrita correctamente?",
    highlight: true,
  },
  {
    type: "Inversión de letras",
    text: "¿Cuál de estas oraciones tiene un error ortográfico?",
    options: [
      "El caballo corre veloz",
      "La vaca come ierba",
      "El perro duerme tranquilo",
      "La niña juega sola",
    ],
    correct: 1,
    audio: "¿Cuál de estas oraciones tiene un error ortográfico?",
    highlight: true,
  },
  {
    type: "Inversión de letras",
    text: "¿Cuál de estas palabras está al revés de 'amor'?",
    options: ["Roma", "Omar", "Mora", "Armo"],
    correct: 0,
    audio: "¿Cuál de estas palabras está al revés de amor?",
    highlight: true,
  },
  // MEMORIA SECUENCIAL
  {
    type: "Memoria secuencial",
    text: "Completa la secuencia: 2, 4, 6, 8, ___",
    options: ["9", "10", "11", "12"],
    correct: 1,
    audio: "Completa la secuencia: 2, 4, 6, 8. ¿Cuál sigue?",
  },
  {
    type: "Memoria secuencial",
    text: "¿Cuál es el orden correcto de los meses?",
    options: [
      "Enero, Marzo, Febrero",
      "Enero, Febrero, Marzo",
      "Febrero, Enero, Marzo",
      "Marzo, Enero, Febrero",
    ],
    correct: 1,
    audio: "¿Cuál es el orden correcto de los meses?",
  },
  {
    type: "Memoria secuencial",
    text: "Lee una vez: 'Mesa, silla, lámpara, ventana'. ¿Cuál fue el tercer objeto?",
    options: ["Mesa", "Silla", "Lámpara", "Ventana"],
    correct: 2,
    audio: "Mesa, silla, lámpara, ventana. ¿Cuál fue el tercer objeto?",
  },
  // VELOCIDAD LECTORA
  {
    type: "Velocidad lectora",
    text: "Lee: 'La neurociencia estudia el sistema nervioso y sus funciones'. ¿Qué estudia la neurociencia?",
    options: [
      "El sistema digestivo",
      "El sistema nervioso",
      "El sistema muscular",
      "El sistema óseo",
    ],
    correct: 1,
    audio: "La neurociencia estudia el sistema nervioso y sus funciones. ¿Qué estudia la neurociencia?",
  },
  {
    type: "Velocidad lectora",
    text: "Lee: 'Las personas con dislexia tienen dificultades con la lectura pero no con la inteligencia'. ¿Qué NO afecta la dislexia?",
    options: ["La lectura", "La escritura", "La inteligencia", "La ortografía"],
    correct: 2,
    audio: "Las personas con dislexia tienen dificultades con la lectura pero no con la inteligencia. ¿Qué no afecta la dislexia?",
  },
  {
    type: "Velocidad lectora",
    text: "Lee: 'Colombia es un país megadiverso ubicado en el noroccidente de Suramérica'. ¿Dónde está Colombia?",
    options: [
      "En Centroamérica",
      "En el sur de Suramérica",
      "En el noroccidente de Suramérica",
      "En el Caribe",
    ],
    correct: 2,
    audio: "Colombia es un país megadiverso ubicado en el noroccidente de Suramérica. ¿Dónde está Colombia?",
  },
];

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
.test-wrap{font-family:'DM Sans',sans-serif;min-height:100vh;background:#FAFAF7;color:#1C1917;}
.test-nav{display:flex;align-items:center;justify-content:space-between;padding:0 clamp(16px,4vw,60px);height:60px;border-bottom:1px solid #EDE5D8;background:rgba(250,250,247,.95);backdrop-filter:blur(10px);position:sticky;top:0;z-index:50;}
.test-logo{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:#1C1917;}
.test-logo span{color:#2D6A4F;}
.test-step{font-size:13px;color:#78716C;}
.test-body{max-width:640px;margin:0 auto;padding:clamp(32px,5vw,60px) clamp(16px,4vw,40px);}

.intro-card{background:white;border:1.5px solid #EDE5D8;border-radius:20px;padding:36px;text-align:center;}
.intro-icon{font-size:48px;margin-bottom:16px;}
.intro-card h1{font-family:'Fraunces',serif;font-size:28px;font-weight:500;color:#1C1917;margin-bottom:10px;}
.intro-card p{font-size:15px;color:#44403C;line-height:1.7;margin-bottom:28px;}
.intro-meta{display:flex;justify-content:center;gap:12px;margin-bottom:28px;flex-wrap:wrap;}
.intro-meta-item{display:flex;align-items:center;gap:6px;font-size:13px;color:#78716C;background:#F5F0E8;padding:6px 14px;border-radius:40px;}

.name-card{background:white;border:1.5px solid #EDE5D8;border-radius:20px;padding:36px;}
.name-card h2{font-family:'Fraunces',serif;font-size:22px;font-weight:500;color:#1C1917;margin-bottom:6px;}
.name-card p{font-size:14px;color:#78716C;margin-bottom:24px;}
.test-input{width:100%;padding:12px 16px;border-radius:12px;border:1.5px solid #EDE5D8;font-family:'DM Sans',sans-serif;font-size:15px;background:#FAFAF7;color:#1C1917;margin-bottom:4px;outline:none;transition:border-color .2s;}
.test-input:focus{border-color:#2D6A4F;}
.test-input-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;}
.test-label{font-size:12px;font-weight:500;color:#78716C;margin-bottom:6px;display:block;}
.age-hint{font-size:11px;color:#78716C;margin-top:4px;margin-bottom:0;}

.test-btn{background:#1C1917;color:#FAFAF7;border:none;padding:14px 32px;border-radius:40px;font-size:15px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:background .2s,transform .15s;}
.test-btn:hover{background:#2D6A4F;transform:translateY(-1px);}
.test-btn:disabled{background:#D6D3D1;cursor:not-allowed;transform:none;}
.test-btn-outline{background:transparent;color:#1C1917;border:1.5px solid #EDE5D8;padding:12px 24px;border-radius:40px;font-size:14px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;margin-right:10px;}
.test-btn-outline:hover{border-color:#1C1917;}

.progress-wrap{margin-bottom:24px;}
.progress-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.progress-title{font-size:12px;font-weight:500;color:#78716C;text-transform:uppercase;letter-spacing:.06em;}
.progress-count{font-size:13px;color:#78716C;}
.progress-track{background:#EDE5D8;border-radius:40px;height:6px;}
.progress-fill{height:6px;border-radius:40px;background:#2D6A4F;transition:width .4s ease;}

.qtimer-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.qtimer-left{display:flex;align-items:center;gap:8px;}
.qtimer-dot{width:7px;height:7px;border-radius:50%;background:#2D6A4F;animation:tdot 2s infinite;}
@keyframes tdot{0%,100%{opacity:1}50%{opacity:.3}}
.qtimer-text{font-size:13px;color:#78716C;}
.qtimer-badge{font-size:12px;color:#78716C;background:#F5F0E8;padding:4px 12px;border-radius:40px;}

.question-card{background:white;border:1.5px solid #EDE5D8;border-radius:20px;padding:28px;margin-bottom:16px;}
.q-type{font-size:11px;font-weight:500;color:#2D6A4F;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;}
.q-text{font-family:'Fraunces',serif;font-size:clamp(17px,3vw,22px);font-weight:500;color:#1C1917;line-height:1.45;margin-bottom:24px;}
.q-text.kids-text{font-size:clamp(18px,3.5vw,24px);line-height:1.5;}

.audio-btn{display:flex;align-items:center;gap:8px;background:#EEF2FF;color:#3730A3;border:none;padding:8px 16px;border-radius:40px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;margin-bottom:20px;transition:background .2s;}
.audio-btn:hover{background:#C7D2FE;}
.audio-btn.playing{background:#C7D2FE;}

.options-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.opt-btn{padding:14px 16px;border:1.5px solid #EDE5D8;border-radius:12px;cursor:pointer;font-size:15px;font-family:'DM Sans',sans-serif;background:white;color:#1C1917;transition:all .15s;text-align:center;line-height:1.4;}
.opt-btn.kids-opt{font-size:clamp(14px,3vw,17px);padding:16px;}
.opt-btn:hover:not(:disabled){border-color:#2D6A4F;background:#D8F3DC;color:#1B4332;}
.opt-btn.correct{border-color:#2D6A4F;background:#D8F3DC;color:#1B4332;font-weight:500;}
.opt-btn.wrong{border-color:#E76F51;background:#FDE8E1;color:#9B2C2C;}
.opt-btn:disabled{cursor:default;}
.opt-btn.highlight{font-family:monospace;font-size:clamp(16px,3vw,20px);letter-spacing:.05em;}

.feedback-row{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;margin-top:8px;font-size:13px;}
.feedback-correct{background:#D8F3DC;color:#1B4332;}
.feedback-wrong{background:#FDE8E1;color:#9B2C2C;}

.profile-chip{display:inline-flex;align-items:center;gap:6px;background:#EEF2FF;color:#3730A3;font-size:12px;font-weight:500;padding:4px 12px;border-radius:40px;margin-bottom:20px;}

.saving-card{background:white;border:1.5px solid #EDE5D8;border-radius:20px;padding:48px;text-align:center;}
.saving-spinner{width:40px;height:40px;border:3px solid #EDE5D8;border-top-color:#2D6A4F;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 16px;}
@keyframes spin{to{transform:rotate(360deg)}}
.saving-card h3{font-family:'Fraunces',serif;font-size:20px;font-weight:500;color:#1C1917;margin-bottom:8px;}
.saving-card p{font-size:14px;color:#78716C;}
`;

export default function Test() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isKids, setIsKids] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [responseTimes, setResponseTimes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [qSeconds, setQSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);
  const totalTimerRef = useRef(null);
  const tStartRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Timer por pregunta
  useEffect(() => {
    if (phase === "test") {
      setQSeconds(0);
      tStartRef.current = Date.now();
      timerRef.current = setInterval(() => setQSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, currentQ]);

  // Timer total
  useEffect(() => {
    if (phase === "test") {
      totalTimerRef.current = setInterval(() => setTotalSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(totalTimerRef.current);
  }, [phase]);

  const startTest = () => {
    const edadNum = parseInt(edad) || 10;
    const kids = edadNum <= 12;
    setIsKids(kids);
    setQuestions(kids ? questionsKids : questionsAdults);
    setPhase("test");
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "es-ES";
    utt.rate = isKids ? 0.85 : 0.95;
    utt.onstart = () => setPlaying(true);
    utt.onend = () => setPlaying(false);
    window.speechSynthesis.speak(utt);
  };

  const handleSelect = (idx) => {
    if (selected !== null) return;
    clearInterval(timerRef.current);
    const rt = Date.now() - tStartRef.current;
    setSelected(idx);
    setShowFeedback(true);
    setAnswers((prev) => [...prev, idx]);
    setResponseTimes((prev) => [...prev, rt]);
  };

  const handleNext = () => {
    window.speechSynthesis?.cancel();
    setPlaying(false);
    setSelected(null);
    setShowFeedback(false);
    if (currentQ + 1 >= questions.length) {
      finishTest();
    } else {
      setCurrentQ((q) => q + 1);
    }
  };

  const calcArea = (indices, ans, qs) => {
    const valid = indices.filter((i) => i < qs.length);
    if (!valid.length) return 0;
    const correct = valid.filter((i) => ans[i] === qs[i].correct).length;
    return Math.round((correct / valid.length) * 100);
  };

  const finishTest = async () => {
    clearInterval(totalTimerRef.current);
    setPhase("saving");

    const allAnswers = answers;
    const qs = questions;
    const score = Math.round(
      (allAnswers.filter((a, i) => a === qs[i].correct).length / qs.length) * 100
    );

    const areas = {
      fonologica: calcArea([0, 1, 2, 3], allAnswers, qs),
      letras: calcArea([4, 5, 6], allAnswers, qs),
      secuencial: calcArea([7, 8, 9], allAnswers, qs),
      lectora: calcArea([10, 11, 12], allAnswers, qs),
    };

    const avgTime = Math.round(
      (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 100)
    ) / 10;

    const perfil = score >= 80 ? "bajo" : score >= 50 ? "moderado" : "alto";
    const audiencia = isKids ? `un niño de ${edad || "entre 6 y 12"} años` : `un adulto de ${edad || "más de 13"} años`;

    const prompt = `Eres un especialista en dislexia. El paciente se llama ${nombre} y es ${audiencia}. Completó un test de cribado con estos resultados: ${score}% de respuestas correctas, tiempo promedio por pregunta: ${avgTime} segundos. Áreas: Conciencia fonológica: ${areas.fonologica}%, Inversión de letras: ${areas.letras}%, Memoria secuencial: ${areas.secuencial}%, Velocidad lectora: ${areas.lectora}%. Da un análisis en 3 oraciones: nivel de riesgo, área más afectada, y una recomendación concreta. Responde en español, de forma empática y clara.`;

    let recomendaciones = "Inicia sesión para ver el análisis completo con IA.";

    try {
      const aiRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const aiData = await aiRes.json();
      recomendaciones = aiData.content?.[0]?.text || recomendaciones;
    } catch (err) {
      console.error(err);
    }

    // Intentar guardar si hay sesión activa
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: patient } = await supabase
          .from("patients")
          .insert({ nombre, edad: parseInt(edad) || null, user_id: user.id })
          .select().single();

        const { data: session } = await supabase
          .from("test_sessions")
          .insert({ patient_id: patient.id, respuestas: allAnswers, tiempos: responseTimes, score })
          .select().single();

        await supabase.from("ai_reports").insert({
          session_id: session.id,
          perfil_riesgo: perfil,
          recomendaciones,
          areas,
        });
      }
    } catch (err) {
      console.error("Error guardando:", err);
    }

    navigate("/resultado", {
      state: { nombre, score, areas, avgTime, recomendaciones, perfilRiesgo: perfil, isKids },
    });
  };

  const q = questions[currentQ];
  const progress = questions.length ? (currentQ / questions.length) * 100 : 0;

  return (
    <div className="test-wrap">
      <nav className="test-nav">
        <span className="test-logo">DislexiaLab<span>.</span></span>
        {phase === "test" && q && (
          <span className="test-step">Pregunta {currentQ + 1} de {questions.length}</span>
        )}
      </nav>

      <div className="test-body">

        {/* INTRO */}
        {phase === "intro" && (
          <div className="intro-card">
            <div className="intro-icon">🧩</div>
            <h1>Test de cribado</h1>
            <p>Una serie de actividades que nos ayudan a identificar posibles indicadores de dislexia. El test se adapta según tu edad. No es un diagnóstico — es una orientación inicial.</p>
            <div className="intro-meta">
              <span className="intro-meta-item">⏱ ~8 minutos</span>
              <span className="intro-meta-item">❓ 13 preguntas</span>
              <span className="intro-meta-item">🔊 Con audio</span>
              <span className="intro-meta-item">🆓 Gratuito</span>
            </div>
            <button className="test-btn" onClick={() => setPhase("name")}>Comenzar →</button>
          </div>
        )}

        {/* NAME */}
        {phase === "name" && (
          <div className="name-card">
            <h2>¿Para quién es la evaluación?</h2>
            <p>El test se adapta automáticamente según la edad.</p>
            <div className="test-input-row">
              <div>
                <label className="test-label">Nombre</label>
                <input className="test-input" placeholder="Ej: Sofía" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div>
                <label className="test-label">Edad</label>
                <input className="test-input" placeholder="Ej: 8" type="number" min="4" max="80" value={edad} onChange={(e) => setEdad(e.target.value)} />
                <p className="age-hint">6–12 años: test para niños · 13+: test para adultos</p>
              </div>
            </div>
            <button className="test-btn-outline" onClick={() => setPhase("intro")}>← Volver</button>
            <button className="test-btn" disabled={!nombre.trim() || !edad} onClick={startTest}>
              Iniciar test →
            </button>
          </div>
        )}

        {/* TEST */}
        {phase === "test" && q && (
          <>
            <div className="profile-chip">
              {isKids ? "👧 Test para niños" : "👤 Test para adultos"} · {nombre}
            </div>

            <div className="progress-wrap">
              <div className="progress-header">
                <span className="progress-title">{q.type}</span>
                <span className="progress-count">{currentQ + 1} / {questions.length}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="qtimer-row">
              <div className="qtimer-left">
                <div className="qtimer-dot" />
                <span className="qtimer-text">Esta pregunta: {qSeconds}s</span>
              </div>
              <span className="qtimer-badge">Total: {totalSeconds}s</span>
            </div>

            <div className="question-card">
              <div className="q-type">{q.type}</div>
              <div className={`q-text${isKids ? " kids-text" : ""}`}>{q.text}</div>

              {q.audio && (
                <button className={`audio-btn${playing ? " playing" : ""}`} onClick={() => speak(q.audio)}>
                  {playing ? "🔊 Reproduciendo..." : "🔊 Escuchar pregunta"}
                </button>
              )}

              <div className="options-grid">
                {q.options.map((opt, i) => {
                  let cls = `opt-btn${isKids ? " kids-opt" : ""}${q.highlight ? " highlight" : ""}`;
                  if (showFeedback) {
                    if (i === q.correct) cls += " correct";
                    else if (i === selected) cls += " wrong";
                  }
                  return (
                    <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={showFeedback}>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div className={`feedback-row ${selected === q.correct ? "feedback-correct" : "feedback-wrong"}`}>
                  {selected === q.correct ? "✓ ¡Correcto!" : `✗ La respuesta correcta era: ${q.options[q.correct]}`}
                </div>
              )}
            </div>

            {showFeedback && (
              <button className="test-btn" style={{ width: "100%" }} onClick={handleNext}>
                {currentQ + 1 >= questions.length ? "Ver resultado →" : "Siguiente →"}
              </button>
            )}
          </>
        )}

        {/* SAVING */}
        {phase === "saving" && (
          <div className="saving-card">
            <div className="saving-spinner" />
            <h3>Analizando resultados...</h3>
            <p>Claude está generando tu reporte personalizado.</p>
          </div>
        )}

      </div>
    </div>
  );
}
