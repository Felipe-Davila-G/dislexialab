import { useState, useEffect, useRef } from "react";
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink: #1C1917; --ink2: #44403C; --ink3: #78716C;
  --cream: #FAFAF7; --warm: #F5F0E8; --warm2: #EDE5D8;
  --accent: #2D6A4F; --accent-light: #D8F3DC; --accent2: #E76F51;
  --accent2-light: #FDE8E1; --indigo: #3D405B; --indigo-light: #E8E9F0;
  --r: 12px; --r2: 20px;
}

.dl-body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); line-height: 1.6; overflow-x: hidden; }

/* NAV */
.dl-nav { position: sticky; top: 0; z-index: 100; background: rgba(250,250,247,.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--warm2); padding: 0 clamp(20px,5vw,80px); height: 64px; display: flex; align-items: center; justify-content: space-between; }
.dl-nav-logo { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; color: var(--ink); text-decoration: none; display: flex; align-items: center; gap: 8px; }
.dl-nav-logo .dot { color: var(--accent); }
.dl-nav-links { display: flex; align-items: center; gap: 28px; list-style: none; }
.dl-nav-links a { font-size: 14px; color: var(--ink2); text-decoration: none; transition: color .2s; cursor: pointer; }
.dl-nav-links a:hover { color: var(--ink); }
.dl-nav-cta { background: var(--ink) !important; color: var(--cream) !important; padding: 8px 20px !important; border-radius: 40px !important; font-weight: 500 !important; transition: background .2s !important; }
.dl-nav-cta:hover { background: var(--accent) !important; }

/* HERO */
.dl-hero { position: relative; padding: clamp(60px,10vw,120px) clamp(20px,5vw,80px) clamp(60px,8vw,100px); display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; max-width: 1200px; margin: 0 auto; }
.dl-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: var(--accent-light); color: var(--accent); font-size: 12px; font-weight: 500; padding: 5px 14px; border-radius: 40px; margin-bottom: 20px; }
.dl-eyebrow::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: dl-pulse 2s infinite; }
@keyframes dl-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
.dl-h1 { font-family: 'Fraunces', serif; font-size: clamp(36px,5vw,58px); font-weight: 500; line-height: 1.1; color: var(--ink); margin-bottom: 20px; letter-spacing: -.02em; }
.dl-h1 em { font-style: italic; color: var(--accent); }
.dl-hero-p { font-size: 17px; color: var(--ink2); line-height: 1.7; margin-bottom: 36px; max-width: 480px; }
.dl-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
.dl-btn-primary { background: var(--ink); color: var(--cream); border: none; padding: 14px 28px; border-radius: 40px; font-size: 15px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background .2s, transform .15s; text-decoration: none; display: inline-block; }
.dl-btn-primary:hover { background: var(--accent); transform: translateY(-2px); }
.dl-btn-secondary { background: transparent; color: var(--ink); border: 1.5px solid var(--warm2); padding: 14px 28px; border-radius: 40px; font-size: 15px; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: border-color .2s, background .2s; display: inline-block; text-decoration: none; }
.dl-btn-secondary:hover { border-color: var(--ink); background: var(--warm); }
.dl-trust { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--ink3); }
.dl-avatars { display: flex; }
.dl-avatars span { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--cream); margin-left: -8px; font-size: 11px; display: flex; align-items: center; justify-content: center; font-weight: 500; }
.dl-avatars span:first-child { margin-left: 0; }
.av1{background:var(--accent-light);color:var(--accent)} .av2{background:var(--accent2-light);color:var(--accent2)} .av3{background:var(--indigo-light);color:var(--indigo)}

/* HERO CARD */
.dl-hero-visual { position: relative; }
.dl-hero-card { background: var(--cream); border: 1.5px solid var(--warm2); border-radius: var(--r2); padding: 28px; animation: dl-floatUp .8s ease both; }
@keyframes dl-floatUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.dl-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.dl-card-title { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 500; }
.dl-status { background: var(--accent-light); color: var(--accent); font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 40px; }
.dl-prog-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--ink3); margin-bottom: 6px; }
.dl-prog-track { background: var(--warm2); border-radius: 40px; height: 8px; margin-bottom: 10px; }
.dl-prog-fill { height: 8px; border-radius: 40px; }
.dl-areas-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
.dl-area-chip { background: var(--warm); border-radius: var(--r); padding: 10px 12px; font-size: 12px; }
.dl-area-chip .lbl { color: var(--ink3); margin-bottom: 3px; }
.dl-area-chip .val { font-weight: 500; font-size: 15px; }
.dl-area-chip.good .val { color: var(--accent); } .dl-area-chip.warn .val { color: #C45D3A; }
.dl-ai-snippet { background: var(--indigo-light); border-radius: var(--r); padding: 12px 14px; font-size: 12px; color: var(--indigo); line-height: 1.6; display: flex; gap: 8px; }
.dl-float-badge { position: absolute; top: -16px; right: 24px; background: var(--accent2); color: white; font-size: 12px; font-weight: 500; padding: 6px 14px; border-radius: 40px; }
.dl-blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; z-index: -1; }
.dl-blob-green { width: 320px; height: 320px; background: rgba(45,106,79,.08); top: -60px; right: -60px; }
.dl-blob-warm { width: 200px; height: 200px; background: rgba(231,111,81,.07); bottom: 20px; left: -40px; }

/* STATS */
.dl-stats { background: var(--ink); padding: 36px clamp(20px,5vw,80px); }
.dl-stats-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; text-align: center; }
.dl-stat-num { font-family: 'Fraunces', serif; font-size: 36px; font-weight: 500; color: var(--cream); line-height: 1; margin-bottom: 4px; }
.dl-stat-lbl { font-size: 13px; color: rgba(250,250,247,.55); }

/* SECTIONS */
.dl-section { position: relative; z-index: 1; }
.dl-inner { max-width: 1200px; margin: 0 auto; padding: 0 clamp(20px,5vw,80px); }
.dl-tag { display: inline-block; font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.dl-section-title { font-family: 'Fraunces', serif; font-size: clamp(28px,3.5vw,42px); font-weight: 500; line-height: 1.15; color: var(--ink); letter-spacing: -.02em; margin-bottom: 16px; }
.dl-section-sub { font-size: 16px; color: var(--ink2); max-width: 520px; line-height: 1.7; }

/* AUDIENCE */
.dl-audiencias { padding: clamp(60px,8vw,100px) 0; }
.dl-audience-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 48px; }
.dl-audience-card { border: 1.5px solid var(--warm2); border-radius: var(--r2); padding: 36px; cursor: pointer; transition: border-color .2s, transform .2s; display: block; color: inherit; text-decoration: none; }
.dl-audience-card:hover { border-color: var(--accent); transform: translateY(-3px); }
.dl-audience-card.kids { background: var(--accent-light); }
.dl-audience-card.adults { background: var(--indigo-light); }
.dl-aud-icon { font-size: 40px; margin-bottom: 16px; line-height: 1; }
.dl-audience-card h3 { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 500; color: var(--ink); margin-bottom: 8px; }
.dl-audience-card p { font-size: 14px; color: var(--ink2); line-height: 1.6; margin-bottom: 20px; }
.dl-aud-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
.dl-aud-tag { font-size: 11px; padding: 3px 10px; border-radius: 40px; background: rgba(255,255,255,.6); color: var(--ink2); }
.dl-aud-link { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; color: var(--accent); }
.dl-audience-card.adults .dl-aud-link { color: var(--indigo); }

/* FEATURES */
.dl-features { padding: clamp(60px,8vw,100px) 0; background: var(--warm); }
.dl-features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-top: 48px; }
.dl-feature-card { background: var(--cream); border: 1px solid var(--warm2); border-radius: var(--r2); padding: 28px; transition: transform .2s; }
.dl-feature-card:hover { transform: translateY(-2px); }
.dl-feat-icon { width: 44px; height: 44px; border-radius: var(--r); display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px; }
.fi-green{background:var(--accent-light)} .fi-orange{background:var(--accent2-light)} .fi-indigo{background:var(--indigo-light)} .fi-yellow{background:#FEF3E2} .fi-pink{background:#FCE4EC} .fi-teal{background:#E0F2F1}
.dl-feature-card h4 { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 500; color: var(--ink); margin-bottom: 8px; }
.dl-feature-card p { font-size: 13px; color: var(--ink2); line-height: 1.6; }

/* PRICING */
.dl-pricing { padding: clamp(60px,8vw,100px) 0; }
.dl-pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-top: 48px; }
.dl-pricing-card { border: 1.5px solid var(--warm2); border-radius: var(--r2); padding: 28px; background: var(--cream); position: relative; }
.dl-pricing-card.featured { border-color: var(--accent); background: var(--ink); }
.dl-pricing-pop { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--accent); color: white; font-size: 11px; font-weight: 500; padding: 4px 14px; border-radius: 40px; white-space: nowrap; }
.dl-plan-name { font-size: 13px; font-weight: 500; color: var(--ink3); margin-bottom: 8px; text-transform: uppercase; letter-spacing: .05em; }
.dl-pricing-card.featured .dl-plan-name { color: rgba(250,250,247,.6); }
.dl-plan-price { font-family: 'Fraunces', serif; font-size: 38px; font-weight: 500; color: var(--ink); line-height: 1; margin-bottom: 4px; }
.dl-pricing-card.featured .dl-plan-price { color: var(--cream); }
.dl-plan-period { font-size: 13px; color: var(--ink3); margin-bottom: 20px; }
.dl-pricing-card.featured .dl-plan-period { color: rgba(250,250,247,.5); }
.dl-divider { height: 1px; background: var(--warm2); margin: 16px 0; }
.dl-pricing-card.featured .dl-divider { background: rgba(250,250,247,.15); }
.dl-pf { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--ink2); margin-bottom: 10px; line-height: 1.4; }
.dl-pricing-card.featured .dl-pf { color: rgba(250,250,247,.75); }
.pf-check{color:var(--accent);font-size:14px;flex-shrink:0} .pf-lock{color:var(--warm2);font-size:14px;flex-shrink:0}
.dl-pricing-card.featured .pf-check{color:#74C69D} .dl-pricing-card.featured .pf-lock{color:rgba(250,250,247,.2)}
.dl-plan-btn { width:100%; padding:12px; border-radius:40px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; margin-top:20px; border:1.5px solid var(--warm2); background:transparent; color:var(--ink); transition:all .2s; }
.dl-plan-btn:hover { border-color:var(--ink); background:var(--warm); }
.dl-pricing-card.featured .dl-plan-btn { background:var(--accent); border-color:var(--accent); color:white; }
.dl-pricing-card.featured .dl-plan-btn:hover { background:#1B4332; }

/* TESTIMONIALS */
.dl-testimonials { padding: clamp(60px,8vw,100px) 0; background: var(--warm); }
.dl-testimonials-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-top: 48px; }
.dl-testimonial-card { background: var(--cream); border: 1px solid var(--warm2); border-radius: var(--r2); padding: 24px; }
.dl-quote { font-family: 'Fraunces', serif; font-size: 16px; font-style: italic; color: var(--ink); line-height: 1.6; margin-bottom: 20px; }
.dl-author { display: flex; align-items: center; gap: 10px; }
.dl-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; flex-shrink: 0; }
.ta1{background:var(--accent-light);color:var(--accent)} .ta2{background:var(--indigo-light);color:var(--indigo)} .ta3{background:var(--accent2-light);color:var(--accent2)}
.dl-author-name { font-size: 14px; font-weight: 500; color: var(--ink); }
.dl-author-role { font-size: 12px; color: var(--ink3); }
.dl-author-loc { font-size: 11px; color: var(--ink3); margin-top: 2px; }

/* ABOUT */
.dl-about { padding: clamp(60px,8vw,100px) 0; }
.dl-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; margin-top: 48px; }
.dl-about-block { margin-bottom: 28px; }
.dl-about-block h4 { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; color: var(--ink); margin-bottom: 8px; }
.dl-about-block p { font-size: 14px; color: var(--ink2); line-height: 1.7; }
.dl-legal-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.dl-legal-card { background: var(--warm); border-radius: var(--r); padding: 16px; font-size: 12px; color: var(--ink2); line-height: 1.6; }
.dl-legal-card strong { display: block; font-size: 13px; color: var(--ink); margin-bottom: 4px; }

/* CTA BANNER */
.dl-cta { background: var(--accent); padding: clamp(48px,6vw,80px) clamp(20px,5vw,80px); text-align: center; }
.dl-cta h2 { font-family: 'Fraunces', serif; font-size: clamp(28px,4vw,44px); font-weight: 500; color: white; letter-spacing: -.02em; margin-bottom: 16px; }
.dl-cta p { font-size: 16px; color: rgba(255,255,255,.8); max-width: 480px; margin: 0 auto 32px; line-height: 1.6; }
.dl-btn-white { background: white; color: var(--accent); border: none; padding: 14px 32px; border-radius: 40px; font-size: 15px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: transform .2s, box-shadow .2s; }
.dl-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.15); }

/* FOOTER */
.dl-footer { background: var(--ink); padding: 48px clamp(20px,5vw,80px) 32px; }
.dl-footer-inner { max-width: 1200px; margin: 0 auto; }
.dl-footer-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; gap: 40px; flex-wrap: wrap; }
.dl-footer-brand p { font-size: 13px; color: rgba(250,250,247,.45); margin-top: 8px; max-width: 220px; line-height: 1.6; }
.dl-footer-logo { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; color: var(--cream); }
.dl-footer-group h5 { font-size: 12px; font-weight: 500; color: rgba(250,250,247,.5); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 12px; }
.dl-footer-group a { display: block; font-size: 13px; color: rgba(250,250,247,.65); text-decoration: none; margin-bottom: 8px; transition: color .2s; cursor: pointer; }
.dl-footer-group a:hover { color: var(--cream); }
.dl-footer-bottom { border-top: 1px solid rgba(250,250,247,.08); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.dl-footer-bottom p { font-size: 12px; color: rgba(250,250,247,.35); }
.dl-footer-bottom a { font-size: 12px; color: rgba(250,250,247,.45); text-decoration: none; }

/* MODAL */
.dl-modal-overlay { display: none; position: fixed; inset: 0; background: rgba(28,25,23,.6); z-index: 200; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
.dl-modal-overlay.open { display: flex; }
.dl-modal-box { background: var(--cream); border-radius: var(--r2); padding: 36px; max-width: 440px; width: 100%; text-align: center; animation: dl-modalIn .25s ease; }
@keyframes dl-modalIn { from{opacity:0;transform:scale(.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
.dl-modal-icon { width: 56px; height: 56px; background: var(--accent-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 16px; }
.dl-modal-box h3 { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 500; color: var(--ink); margin-bottom: 8px; }
.dl-modal-box p { font-size: 14px; color: var(--ink2); line-height: 1.6; margin-bottom: 24px; }
.dl-modal-input { width:100%; padding:11px 16px; border-radius:40px; border:1.5px solid var(--warm2); font-family:'DM Sans',sans-serif; font-size:14px; background:var(--cream); color:var(--ink); margin-bottom:8px; outline:none; }
.dl-modal-input:focus { border-color: var(--accent); }
.dl-modal-btns { display: flex; flex-direction: column; gap: 10px; }
.dl-modal-primary { background: var(--ink); color: var(--cream); border: none; padding: 13px; border-radius: 40px; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background .2s; }
.dl-modal-primary:hover { background: var(--accent); }
.dl-modal-skip { background: transparent; color: var(--ink3); border: none; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 8px; }

/* FADE IN */
.dl-fade { opacity: 0; transform: translateY(16px); transition: opacity .6s ease, transform .6s ease; }
.dl-fade.visible { opacity: 1; transform: translateY(0); }

@media (max-width: 768px) {
  .dl-hero { grid-template-columns: 1fr; gap: 40px; }
  .dl-audience-grid { grid-template-columns: 1fr; }
  .dl-features-grid { grid-template-columns: 1fr 1fr; }
  .dl-pricing-grid { grid-template-columns: 1fr; }
  .dl-testimonials-grid { grid-template-columns: 1fr; }
  .dl-about-grid { grid-template-columns: 1fr; }
  .dl-stats-inner { grid-template-columns: repeat(2,1fr); }
  .dl-nav-links { display: none; }
}
@media (max-width: 480px) {
  .dl-features-grid { grid-template-columns: 1fr; }
}
`;

export default function Landing() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [email, setEmail] = useState("");
  const fadeRefs = useRef([]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addFade = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="dl-body">
      {/* NAV */}
      <nav className="dl-nav">
        <span className="dl-nav-logo">DislexiaLab<span className="dot">.</span></span>
        <ul className="dl-nav-links">
          <li><a onClick={() => scrollTo("audiencias")}>Evaluaciones</a></li>
          <li><a onClick={() => scrollTo("features")}>Funciones</a></li>
          <li><a onClick={() => scrollTo("pricing")}>Planes</a></li>
          <li><a onClick={() => scrollTo("about")}>Nosotros</a></li>
          <li><a onClick={() => scrollTo("contact")}>Contacto</a></li>
          <li><a onClick={() => navigate('/perfil')}>Mi progreso</a></li>
          <li>
            {user 
              ? <a className="dl-nav-cta" onClick={signOut}>Cerrar sesión</a>
              : <a className="dl-nav-cta" onClick={() => navigate('/login')}>Iniciar sesión</a>
              
            }
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="dl-section">
        <div className="dl-hero">
          <div>
            <div className="dl-eyebrow">Herramienta de evaluación interactiva</div>
            <h1 className="dl-h1">Detecta la dislexia de forma <em>temprana</em> y efectiva</h1>
            <p className="dl-hero-p">Ejercicios interactivos diseñados por especialistas para identificar señales de dislexia en niños y adultos de manera lúdica y accesible. Con análisis de inteligencia artificial.</p>
            <div className="dl-hero-btns">
              <button className="dl-btn-primary" onClick={() => scrollTo("audiencias")}>Comenzar evaluación</button>
              <button className="dl-btn-secondary" onClick={() => scrollTo("features")}>Ver cómo funciona</button>
            </div>
            <div className="dl-trust">
              <div className="dl-avatars">
                <span className="av1">RS</span>
                <span className="av2">EV</span>
                <span className="av3">LF</span>
              </div>
              <span>+30 evaluaciones realizadas · Bogotá, Colombia</span>
            </div>
          </div>
          <div className="dl-hero-visual">
            <div className="dl-blob dl-blob-green" />
            <div className="dl-blob dl-blob-warm" />
            <div className="dl-float-badge">✨ Análisis con IA</div>
            <div className="dl-hero-card">
              <div className="dl-card-header">
                <span className="dl-card-title">Resultado — Sofía M., 8 años</span>
                <span className="dl-status">Completado</span>
              </div>
              <div>
                <div className="dl-prog-label"><span>Puntuación general</span><span>68%</span></div>
                <div className="dl-prog-track"><div className="dl-prog-fill" style={{width:"68%", background:"var(--accent)"}} /></div>
                <div className="dl-prog-label"><span>Fonológica</span><span>45%</span></div>
                <div className="dl-prog-track"><div className="dl-prog-fill" style={{width:"45%", background:"#E76F51"}} /></div>
              </div>
              <div className="dl-areas-row">
                <div className="dl-area-chip warn"><div className="lbl">Inversión letras</div><div className="val">Prioritario</div></div>
                <div className="dl-area-chip good"><div className="lbl">Memoria visual</div><div className="val">Normal</div></div>
                <div className="dl-area-chip warn"><div className="lbl">Conciencia fon.</div><div className="val">Atención</div></div>
                <div className="dl-area-chip good"><div className="lbl">Velocidad lectora</div><div className="val">Adecuada</div></div>
              </div>
              <div className="dl-ai-snippet">
                <span>✦</span>
                <span>Sofía muestra indicadores moderados en conciencia fonológica. Se recomienda iniciar ejercicios de discriminación de sonidos 3 veces por semana.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="dl-stats">
        <div className="dl-stats-inner">
          {[["30+","Evaluaciones realizadas"],["15","Profesionales activos"],["4/5","Valoración promedio"],["100%","Gratuito para comenzar"]].map(([n,l])=>(
            <div key={l}><div className="dl-stat-num">{n}</div><div className="dl-stat-lbl">{l}</div></div>
          ))}
        </div>
      </div>

      {/* AUDIENCIAS */}
      <section className="dl-section dl-audiencias" id="audiencias">
        <div className="dl-inner">
          <span className="dl-tag">Evaluaciones</span>
          <h2 className="dl-section-title">Adaptado para cada etapa de vida</h2>
          <p className="dl-section-sub">Ejercicios diseñados según la edad y el perfil del evaluado, con resultados comprensibles para padres y profesionales.</p>
          <div className="dl-audience-grid dl-fade" ref={addFade}>
            <div className="dl-audience-card kids" onClick={() => navigate('/test')}>
              <div className="dl-aud-icon">🧒</div>
              <h3>Para niños</h3>
              <div className="dl-aud-tags">
                <span className="dl-aud-tag">6 – 12 años</span>
                <span className="dl-aud-tag">Ejercicios lúdicos</span>
                <span className="dl-aud-tag">Colorido e intuitivo</span>
              </div>
              <p>Evaluaciones gamificadas que los niños disfrutan sin sentirse evaluados. Diseñadas para detectar señales tempranas de forma natural.</p>
              <span className="dl-aud-link">Comenzar evaluación →</span>
            </div>
            <div className="dl-audience-card adults" onClick={() => navigate('/test')}>
              <div className="dl-aud-icon">👤</div>
              <h3>Para adultos</h3>
              <div className="dl-aud-tags">
                <span className="dl-aud-tag">+13 años</span>
                <span className="dl-aud-tag">Evaluación profesional</span>
                <span className="dl-aud-tag">Reporte detallado</span>
              </div>
              <p>Evaluación adaptada para adolescentes y adultos que sospechan dificultades lectoras o quieren conocer mejor su perfil de aprendizaje.</p>
              <span className="dl-aud-link">Comenzar evaluación →</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="dl-section dl-features" id="features">
        <div className="dl-inner">
          <span className="dl-tag">Funciones</span>
          <h2 className="dl-section-title">Todo lo que necesitas para el seguimiento</h2>
          <p className="dl-section-sub">Desde la detección inicial hasta el acompañamiento continuo, en una sola plataforma.</p>
          <div className="dl-features-grid dl-fade" ref={addFade}>
            {[
              {icon:"🔤",bg:"fi-green",title:"Ejercicios variados",desc:"Lectoescritura, conciencia fonológica, memoria visual y juegos de palabras diseñados por especialistas."},
              {icon:"⏱",bg:"fi-orange",title:"Tiempo controlado",desc:"Cada ejercicio mide el tiempo de respuesta, un indicador clave para detectar dificultades de procesamiento."},
              {icon:"✦",bg:"fi-indigo",title:"Análisis con IA",desc:"Claude analiza los resultados y genera un reporte personalizado con recomendaciones específicas para el paciente."},
              {icon:"📈",bg:"fi-yellow",title:"Seguimiento de progreso",desc:"Gráficas de evolución por área para que padres y docentes vean el avance real a lo largo del tiempo."},
              {icon:"📄",bg:"fi-pink",title:"Reporte PDF",desc:"Descarga un informe clínico completo listo para compartir con el colegio, el médico o el especialista."},
              {icon:"🔒",bg:"fi-teal",title:"Privacidad garantizada",desc:"Cumplimos la Ley 1581 de 2012. Tus datos no se comparten con terceros y son de uso exclusivamente académico."},
            ].map(f => (
              <div className="dl-feature-card" key={f.title}>
                <div className={`dl-feat-icon ${f.bg}`}>{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="dl-section dl-pricing" id="pricing">
        <div className="dl-inner">
          <span className="dl-tag">Planes</span>
          <h2 className="dl-section-title">Comienza gratis, crece cuando lo necesites</h2>
          <p className="dl-section-sub">Modelo freemium pensado para que ninguna familia quede sin acceso a una primera orientación.</p>
          <div className="dl-pricing-grid dl-fade" ref={addFade}>
            {/* FREE */}
            <div className="dl-pricing-card">
              <div className="dl-plan-name">Gratis</div>
              <div className="dl-plan-price">$0</div>
              <div className="dl-plan-period">Siempre gratuito</div>
              <div className="dl-divider" />
              {[["✓","1 evaluación de cribado"],["✓","Resultado básico de riesgo"],["✓","3 ejercicios de práctica"],["–","Reporte PDF detallado"],["–","Análisis IA personalizado"],["–","Historial de progreso"]].map(([ic,txt])=>(
                <div className="dl-pf" key={txt}><span className={ic==="✓"?"pf-check":"pf-lock"}>{ic}</span>{txt}</div>
              ))}
              <button className="dl-plan-btn" onClick={() => setModalOpen(true)}>Comenzar gratis</button>
            </div>
            {/* PRO */}
            <div className="dl-pricing-card featured">
              <div className="dl-pricing-pop">Más popular</div>
              <div className="dl-plan-name">Pro Familia</div>
              <div className="dl-plan-price">$19.900</div>
              <div className="dl-plan-period">COP / mes</div>
              <div className="dl-divider" />
              {[["✓","Evaluaciones ilimitadas"],["✓","Reporte PDF descargable"],["✓","Análisis IA completo"],["✓","Todos los ejercicios"],["✓","Historial y gráficas de avance"],["–","Múltiples pacientes"]].map(([ic,txt])=>(
                <div className="dl-pf" key={txt}><span className={ic==="✓"?"pf-check":"pf-lock"}>{ic}</span>{txt}</div>
              ))}
              <button className="dl-plan-btn" onClick={() => setModalOpen(true)}>Empezar prueba gratis</button>
            </div>
            {/* CLINIC */}
            <div className="dl-pricing-card">
              <div className="dl-plan-name">Clínica / Docente</div>
              <div className="dl-plan-price">$59.900</div>
              <div className="dl-plan-period">COP / mes</div>
              <div className="dl-divider" />
              {[["✓","Todo lo de Pro Familia"],["✓","Hasta 30 pacientes"],["✓","Dashboard multi-paciente"],["✓","Exportar reportes en lote"],["✓","Notas clínicas por paciente"],["✓","Factura electrónica"]].map(([ic,txt])=>(
                <div className="dl-pf" key={txt}><span className={ic==="✓"?"pf-check":"pf-lock"}>{ic}</span>{txt}</div>
              ))}
              <button className="dl-plan-btn" onClick={() => setModalOpen(true)}>Contactar para demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="dl-section dl-testimonials" id="testimonials">
        <div className="dl-inner">
          <span className="dl-tag">Testimonios</span>
          <h2 className="dl-section-title">Lo que dicen quienes ya lo usan</h2>
          <p className="dl-section-sub">Personas de todas las edades utilizan DislexiaLab para evaluar su lectura y conocer posibles dificultades.</p>
          <div className="dl-testimonials-grid dl-fade" ref={addFade}>
            {[
              {av:"RS",cls:"ta1",q:"Mi hija se divirtió mucho haciendo los ejercicios, no se sintió evaluada, sino jugando. Los resultados fueron muy útiles para hablar con su maestra.",name:"Roberto Silva",role:"Padre de familia",loc:"Bogotá, Colombia"},
              {av:"EV",cls:"ta2",q:"Rápida, útil y precisa. Una excelente herramienta complementaria para detectar señales tempranas de dislexia en mi consulta.",name:"Dra. Elena Vega",role:"Neuropsicóloga",loc:"Bogotá, Colombia"},
              {av:"LF",cls:"ta3",q:"Esta página es chévere, me ayuda a leer sin trabarme y los juegos son divertidos. ¡Me siento mejor en el colegio!",name:"Luis Fernández",role:"Niño evaluado, 9 años",loc:"Bogotá, Colombia"},
            ].map(t=>(
              <div className="dl-testimonial-card" key={t.name}>
                <p className="dl-quote">"{t.q}"</p>
                <div className="dl-author">
                  <div className={`dl-avatar ${t.cls}`}>{t.av}</div>
                  <div>
                    <div className="dl-author-name">{t.name}</div>
                    <div className="dl-author-role">{t.role}</div>
                    <div className="dl-author-loc">{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="dl-section dl-about" id="about">
        <div className="dl-inner">
          <span className="dl-tag">Nosotros</span>
          <h2 className="dl-section-title">Nuestro propósito</h2>
          <div className="dl-about-grid dl-fade" ref={addFade}>
            <div>
              <div className="dl-about-block">
                <h4>Nuestra misión</h4>
                <p>DislexiaLab nació con el objetivo de democratizar la detección temprana de la dislexia. Creemos que todos los niños y adultos merecen acceso a herramientas de evaluación precisas y accesibles que les permitan entender mejor sus fortalezas y desafíos de aprendizaje.</p>
              </div>
              <div className="dl-about-block">
                <h4>Nuestro equipo</h4>
                <p>Somos un grupo de estudiantes de la Universidad Central que busca aportar a la educación mediante una plataforma que facilite la identificación temprana de señales de dislexia, con herramientas accesibles para niños, jóvenes y adultos.</p>
              </div>
            </div>
            <div>
              <h4 style={{fontFamily:"'Fraunces',serif",fontSize:"18px",fontWeight:500,color:"var(--ink)",marginBottom:"16px"}}>Aspectos legales</h4>
              <div className="dl-legal-cards">
                {[
                  ["Términos de uso","Esta plataforma es un proyecto académico. No reemplaza una valoración profesional realizada por especialistas."],
                  ["Privacidad","Cumplimos la Ley 1581 de 2012. Tu información se usa solo con fines académicos y no se comparte con terceros."],
                  ["Responsabilidad social","Buscamos aportar a la comunidad educativa ofreciendo recursos accesibles para familias y colegios."],
                  ["Limitaciones","DislexiaLab es una herramienta de orientación temprana y no ofrece diagnósticos clínicos."],
                ].map(([t,d])=>(
                  <div className="dl-legal-card" key={t}><strong>{t}</strong>{d}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="dl-cta">
        <h2>¿Listo para hacer la primera evaluación?</h2>
        <p>Es gratis, toma menos de 10 minutos y puede marcar una gran diferencia en el aprendizaje de tu hijo.</p>
        <button className="dl-btn-white" onClick={() => navigate('/test')}>Comenzar evaluación gratis</button>
      </div>

      {/* FOOTER */}
      <footer className="dl-footer" id="contact">
        <div className="dl-footer-inner">
          <div className="dl-footer-top">
            <div className="dl-footer-brand">
              <div className="dl-footer-logo">DislexiaLab<span style={{color:"var(--accent)"}}>.</span></div>
              <p>Detección temprana de dislexia con inteligencia artificial. Universidad Central, Bogotá.</p>
            </div>
            <div className="dl-footer-group">
              <h5>Plataforma</h5>
              <a onClick={() => scrollTo("audiencias")}>Evaluación niños</a>
              <a onClick={() => scrollTo("audiencias")}>Evaluación adultos</a>
              <a onClick={() => scrollTo("features")}>Funciones</a>
              <a onClick={() => scrollTo("pricing")}>Planes</a>
            </div>
            <div className="dl-footer-group">
              <h5>Empresa</h5>
              <a onClick={() => scrollTo("about")}>Acerca de</a>
              <a onClick={() => scrollTo("testimonials")}>Testimonios</a>
              <a onClick={() => scrollTo("about")}>Legal</a>
            </div>
            <div className="dl-footer-group">
              <h5>Contacto</h5>
              <a href="mailto:soporte.dislexialab@gmail.com">soporte.dislexialab@gmail.com</a>
              <a>Lun–Jue 7:00am – 2:00pm</a>
              <a>Bogotá, Colombia</a>
            </div>
          </div>
          <div className="dl-footer-bottom">
            <p>© 2025 DislexiaLab. Todos los derechos reservados. Proyecto académico — Universidad Central.</p>
            <a href="mailto:soporte.dislexialab@gmail.com">soporte.dislexialab@gmail.com</a>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      <div className={`dl-modal-overlay${modalOpen ? " open" : ""}`} onClick={(e) => e.target.classList.contains("dl-modal-overlay") && setModalOpen(false)}>
        <div className="dl-modal-box">
          <div className="dl-modal-icon">🚀</div>
          <h3>Próximamente disponible</h3>
          <p>Estamos terminando el módulo de evaluación interactiva. Déjanos tu correo y te avisamos cuando esté listo.</p>
          <div className="dl-modal-btns">
            <input className="dl-modal-input" type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} />
            <button className="dl-modal-primary">Notificarme</button>
            <button className="dl-modal-skip" onClick={() => setModalOpen(false)}>Ahora no</button>
          </div>
        </div>
      </div>
    </div>
  );
}
