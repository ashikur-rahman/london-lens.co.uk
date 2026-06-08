
import { useState, useEffect, useCallback, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:    #0d1b2a;
    --navy2:   #152436;
    --navy3:   #1e3448;
    --gold:    #c9a84c;
    --gold2:   #e2c97e;
    --gold3:   #f5e9c2;
    --cream:   #f9f6f0;
    --cream2:  #f0ebe0;
    --ink:     #1a1f2e;
    --muted:   #6b7280;
    --border:  #e5e0d5;
    --white:   #ffffff;
    --success: #166534;
    --danger:  #991b1b;
    --serif:   'Playfair Display', Georgia, serif;
    --sans:    'Outfit', system-ui, sans-serif;
    --radius:  10px;
    --shadow:  0 4px 24px rgba(13,27,42,0.10);
    --shadow-lg: 0 12px 48px rgba(13,27,42,0.18);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--sans);
    background: var(--cream);
    color: var(--ink);
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--cream2); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes pulse {
    0%,100% { opacity:1; }
    50%      { opacity:.5; }
  }
  @keyframes slideIn {
    from { transform:translateX(100%); opacity:0; }
    to   { transform:translateX(0);    opacity:1; }
  }
  @keyframes rotateSkyline {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes float {
    0%,100% { transform:translateY(0px); }
    50%      { transform:translateY(-8px); }
  }

  .fade-up { animation: fadeUp .6s ease both; }
  .fade-up-1 { animation-delay:.1s; }
  .fade-up-2 { animation-delay:.2s; }
  .fade-up-3 { animation-delay:.3s; }
  .fade-up-4 { animation-delay:.4s; }

  /* BUTTONS */
  .btn {
    display:inline-flex; align-items:center; gap:6px;
    padding:11px 24px; border-radius:var(--radius);
    font-family:var(--sans); font-size:14px; font-weight:600;
    cursor:pointer; border:none; transition:all .2s; letter-spacing:.3px;
    text-decoration:none;
  }
  .btn-gold {
    background:var(--gold); color:var(--navy);
  }
  .btn-gold:hover { background:var(--gold2); transform:translateY(-1px); box-shadow:0 6px 20px rgba(201,168,76,.35); }
  .btn-navy {
    background:var(--navy); color:var(--gold);
    border: 1px solid rgba(201,168,76,.3);
  }
  .btn-navy:hover { background:var(--navy2); transform:translateY(-1px); }
  .btn-outline {
    background:transparent; color:var(--gold);
    border: 1.5px solid rgba(201,168,76,.5);
  }
  .btn-outline:hover { background:rgba(201,168,76,.08); border-color:var(--gold); }
  .btn-ghost {
    background:transparent; color:var(--muted);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover { background:var(--cream2); color:var(--ink); }
  .btn-sm { padding:7px 16px; font-size:13px; }
  .btn-lg { padding:14px 32px; font-size:15px; }
  .btn-full { width:100%; justify-content:center; }

  /* INPUTS */
  .input {
    width:100%; padding:11px 14px;
    border:1.5px solid var(--border); border-radius:var(--radius);
    font-family:var(--sans); font-size:14px; color:var(--ink);
    background:var(--white); outline:none; transition:border-color .2s;
  }
  .input:focus { border-color:var(--gold); }
  .input::placeholder { color:var(--muted); }

  .select {
    width:100%; padding:11px 14px;
    border:1.5px solid var(--border); border-radius:var(--radius);
    font-family:var(--sans); font-size:14px; color:var(--ink);
    background:var(--white); outline:none; cursor:pointer;
    -webkit-appearance:none;
  }
  .select:focus { border-color:var(--gold); }

  /* CARDS */
  .card {
    background:var(--white); border-radius:14px;
    border:1px solid var(--border); overflow:hidden;
    transition:all .25s;
  }
  .card:hover { box-shadow:var(--shadow-lg); transform:translateY(-3px); }
  .card-flat { background:var(--white); border-radius:14px; border:1px solid var(--border); overflow:hidden; }

  /* BADGE */
  .badge {
    display:inline-flex; align-items:center;
    padding:3px 10px; border-radius:20px;
    font-size:11px; font-weight:600; letter-spacing:.4px; text-transform:uppercase;
  }
  .badge-gold { background:rgba(201,168,76,.15); color:#8a6820; }
  .badge-navy { background:var(--navy); color:var(--gold); }
  .badge-green { background:#dcfce7; color:#166534; }
  .badge-red { background:#fee2e2; color:#991b1b; }

  /* SECTION */
  .section { padding:72px 0; }
  .section-sm { padding:48px 0; }
  .container { max-width:1120px; margin:0 auto; padding:0 24px; }
  .container-sm { max-width:760px; margin:0 auto; padding:0 24px; }

  /* GRID */
  .grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:24px; }
  .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }

  /* DIVIDER */
  .divider { height:1px; background:var(--border); margin:24px 0; }

  /* TOAST */
  .toast {
    position:fixed; bottom:24px; right:24px; z-index:9999;
    background:var(--navy); color:var(--white);
    padding:12px 20px; border-radius:10px;
    border-left:4px solid var(--gold);
    font-size:14px; font-weight:500;
    box-shadow:var(--shadow-lg);
    animation:slideIn .3s ease;
    display:flex; align-items:center; gap:10px;
    max-width:340px;
  }

  /* GOLD LINE */
  .gold-line {
    width:48px; height:2px;
    background:linear-gradient(90deg,var(--gold),var(--gold2));
    border-radius:2px;
  }

  /* SECTION HEADER */
  .section-header { margin-bottom:40px; }
  .section-header .eyebrow {
    font-size:11px; letter-spacing:2.5px; text-transform:uppercase;
    color:var(--gold); font-weight:600; margin-bottom:10px;
  }
  .section-header h2 {
    font-family:var(--serif); font-size:34px; font-weight:700;
    color:var(--navy); line-height:1.2; margin-bottom:12px;
  }
  .section-header p { color:var(--muted); font-size:16px; max-width:520px; }

  /* NAV */
  nav.main-nav {
    position:sticky; top:0; z-index:100;
    background:var(--navy);
    border-bottom:1px solid rgba(201,168,76,.15);
    height:64px; display:flex; align-items:center;
  }
  .nav-inner {
    display:flex; align-items:center; justify-content:space-between;
    width:100%;
  }
  .nav-logo {
    font-family:var(--serif); color:var(--gold);
    font-size:21px; font-weight:700; display:flex; align-items:center; gap:10px;
    cursor:pointer;
  }
  .nav-links { display:flex; align-items:center; gap:4px; }
  .nav-link {
    padding:6px 12px; color:rgba(255,255,255,.65);
    font-size:13.5px; font-weight:500; cursor:pointer;
    border-radius:6px; transition:all .2s;
    border:none; background:none; font-family:var(--sans);
  }
  .nav-link:hover { color:var(--gold); background:rgba(201,168,76,.08); }
  .nav-link.active { color:var(--gold); }
  .nav-cart {
    position:relative; cursor:pointer;
    padding:8px 16px; border-radius:8px;
    background:rgba(201,168,76,.12); color:var(--gold);
    font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px;
    border:1px solid rgba(201,168,76,.25); transition:all .2s;
  }
  .nav-cart:hover { background:rgba(201,168,76,.2); }
  .cart-bubble {
    position:absolute; top:-6px; right:-6px;
    background:var(--gold); color:var(--navy);
    width:18px; height:18px; border-radius:50%;
    font-size:10px; font-weight:700;
    display:flex; align-items:center; justify-content:center;
  }

  /* HERO */
  .hero {
    background:var(--navy);
    position:relative; overflow:hidden;
    min-height:88vh; display:flex; flex-direction:column; justify-content:center;
  }
  .hero-grain {
    position:absolute; inset:0; opacity:.04;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }
  .hero-glow {
    position:absolute; bottom:-200px; left:50%;
    transform:translateX(-50%);
    width:900px; height:500px;
    background:radial-gradient(ellipse, rgba(201,168,76,.12) 0%, transparent 70%);
    pointer-events:none;
  }
  .hero-skyline {
    position:absolute; bottom:0; left:0; right:0; height:200px;
    overflow:hidden; pointer-events:none;
  }
  .skyline-track {
    display:flex; height:200px;
    animation:rotateSkyline 60s linear infinite;
    width:200%;
  }
  .hero-content {
    position:relative; z-index:2;
    padding:0 24px;
    text-align:center;
  }
  .hero-eyebrow {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(201,168,76,.12); border:1px solid rgba(201,168,76,.25);
    color:var(--gold2); padding:6px 16px; border-radius:20px;
    font-size:12px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;
    margin-bottom:28px;
  }
  .hero h1 {
    font-family:var(--serif); color:var(--white);
    font-size:clamp(38px,6vw,68px); font-weight:700; line-height:1.1;
    margin-bottom:20px;
  }
  .hero h1 em { color:var(--gold); font-style:italic; }
  .hero-sub {
    color:rgba(255,255,255,.6); font-size:17px;
    max-width:520px; margin:0 auto 36px; line-height:1.7;
  }
  .hero-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-bottom:56px; }
  .hero-trust {
    display:flex; gap:32px; justify-content:center; flex-wrap:wrap;
    border-top:1px solid rgba(255,255,255,.07);
    padding-top:28px;
  }
  .trust-item {
    display:flex; align-items:center; gap:8px;
    color:rgba(255,255,255,.5); font-size:13px; font-weight:500;
  }
  .trust-dot { width:6px; height:6px; border-radius:50%; background:var(--gold); }

  /* PRODUCT CARDS */
  .product-img-wrap {
    height:180px; display:flex; align-items:center; justify-content:center;
    font-size:52px; position:relative;
    background:linear-gradient(135deg, var(--cream) 0%, var(--cream2) 100%);
  }
  .product-img-wrap .cat-badge {
    position:absolute; top:10px; left:10px;
  }
  .product-img-wrap .sale-badge {
    position:absolute; top:10px; right:10px;
  }
  .product-body { padding:16px 18px 20px; }
  .product-title {
    font-family:var(--serif); font-size:16px; font-weight:600;
    color:var(--navy); margin-bottom:5px; line-height:1.3;
  }
  .product-desc {
    font-size:13px; color:var(--muted); margin-bottom:14px; line-height:1.5;
  }
  .product-meta {
    display:flex; align-items:center; justify-content:space-between;
  }
  .product-price { font-size:20px; font-weight:700; color:var(--navy); }
  .product-price-old {
    font-size:13px; color:var(--muted); text-decoration:line-through; margin-right:4px;
  }

  /* CONSULTATION CARDS */
  .consult-card {
    border:2px solid var(--border); border-radius:14px;
    padding:28px 24px; background:var(--white);
    cursor:pointer; transition:all .25s; position:relative;
  }
  .consult-card:hover { border-color:var(--gold); box-shadow:var(--shadow); }
  .consult-card.selected {
    border-color:var(--gold);
    background:linear-gradient(135deg, #fffdf4 0%, #fff9e6 100%);
    box-shadow:0 8px 32px rgba(201,168,76,.2);
  }
  .consult-popular {
    position:absolute; top:-12px; left:50%; transform:translateX(-50%);
    background:var(--gold); color:var(--navy);
    padding:3px 14px; border-radius:12px; font-size:11px; font-weight:700;
    letter-spacing:.5px; white-space:nowrap;
  }
  .consult-tier {
    font-family:var(--serif); font-size:22px; font-weight:700;
    color:var(--navy); margin-bottom:4px;
  }
  .consult-duration { font-size:13px; color:var(--muted); margin-bottom:16px; }
  .consult-price { font-size:32px; font-weight:700; color:var(--navy); margin-bottom:20px; }
  .consult-features { list-style:none; }
  .consult-features li {
    font-size:13px; color:var(--ink); padding:5px 0;
    display:flex; align-items:center; gap:8px;
    border-top:1px solid var(--border);
  }
  .consult-features li::before { content:'✓'; color:var(--gold); font-weight:700; }

  /* TOOLS */
  .tool-card {
    background:var(--white); border:1px solid var(--border);
    border-radius:14px; padding:28px;
  }
  .tool-card h3 {
    font-family:var(--serif); font-size:18px; color:var(--navy); margin-bottom:20px;
  }
  .range-wrap { margin-bottom:16px; }
  .range-label {
    display:flex; justify-content:space-between;
    font-size:13px; color:var(--muted); margin-bottom:6px;
  }
  .range-label span { color:var(--navy); font-weight:600; }
  input[type=range] {
    width:100%; height:4px; border-radius:2px;
    background:linear-gradient(90deg, var(--gold) var(--pct,50%), var(--border) var(--pct,50%));
    -webkit-appearance:none; outline:none; cursor:pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance:none;
    width:18px; height:18px; border-radius:50%;
    background:var(--gold); border:3px solid var(--white);
    box-shadow:0 2px 8px rgba(201,168,76,.5); cursor:pointer;
  }
  .calc-result {
    background:var(--navy); border-radius:12px; padding:20px;
    display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px;
  }
  .calc-stat { text-align:center; }
  .calc-val {
    font-family:var(--serif); font-size:22px; color:var(--gold); font-weight:700;
  }
  .calc-label { font-size:11px; color:rgba(255,255,255,.45); margin-top:3px; }

  /* MEMBERSHIP */
  .mem-card {
    border:2px solid var(--border); border-radius:16px; overflow:hidden;
    transition:all .25s;
  }
  .mem-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); }
  .mem-card.featured { border-color:var(--gold); }
  .mem-header { padding:28px 24px; text-align:center; }
  .mem-card.featured .mem-header { background:var(--navy); }
  .mem-name {
    font-family:var(--serif); font-size:20px; font-weight:700; margin-bottom:8px;
  }
  .mem-card.featured .mem-name { color:var(--gold); }
  .mem-price { font-size:36px; font-weight:700; color:var(--navy); }
  .mem-card.featured .mem-price { color:var(--white); }
  .mem-period { font-size:13px; color:var(--muted); font-weight:400; }
  .mem-card.featured .mem-period { color:rgba(255,255,255,.5); }
  .mem-features { padding:20px 24px; list-style:none; }
  .mem-features li {
    padding:8px 0; font-size:14px; border-top:1px solid var(--border);
    display:flex; align-items:center; gap:8px; color:var(--ink);
  }
  .mem-features li .icon-yes { color:var(--gold); }
  .mem-features li .icon-no { color:var(--border); }
  .mem-footer { padding:0 24px 24px; }

  /* BLOG */
  .blog-card { cursor:pointer; }
  .blog-img {
    height:160px; display:flex; align-items:center; justify-content:center;
    font-size:48px; background:linear-gradient(135deg,var(--cream),var(--cream2));
  }
  .blog-body { padding:16px 18px 20px; }
  .blog-meta { font-size:12px; color:var(--muted); margin-bottom:8px; }
  .blog-title {
    font-family:var(--serif); font-size:17px; font-weight:600;
    color:var(--navy); margin-bottom:6px; line-height:1.3;
  }
  .blog-excerpt { font-size:13px; color:var(--muted); line-height:1.5; }

  /* DASHBOARD */
  .dash-stat {
    background:var(--white); border:1px solid var(--border); border-radius:12px;
    padding:20px; text-align:center;
  }
  .dash-stat-val {
    font-family:var(--serif); font-size:28px; font-weight:700; color:var(--gold);
  }
  .dash-stat-label { font-size:12px; color:var(--muted); margin-top:4px; }
  .dash-tab {
    padding:8px 18px; border-radius:8px; border:none; background:none;
    font-family:var(--sans); font-size:14px; font-weight:500; cursor:pointer;
    color:var(--muted); transition:all .2s;
  }
  .dash-tab.active {
    background:var(--navy); color:var(--gold);
  }

  /* LEAD MAGNET */
  .lead-box {
    background:linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%);
    border-radius:20px; padding:48px; text-align:center;
    border:1px solid rgba(201,168,76,.15);
    position:relative; overflow:hidden;
  }
  .lead-box::before {
    content:''; position:absolute; top:-100px; right:-100px;
    width:300px; height:300px; border-radius:50%;
    background:radial-gradient(circle, rgba(201,168,76,.08) 0%, transparent 70%);
  }
  .lead-box h3 { font-family:var(--serif); color:var(--white); font-size:26px; margin-bottom:10px; }
  .lead-box p { color:rgba(255,255,255,.6); font-size:15px; margin-bottom:28px; }
  .lead-form { display:flex; gap:10px; max-width:440px; margin:0 auto; }
  .lead-form .input { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.2); color:var(--white); }
  .lead-form .input::placeholder { color:rgba(255,255,255,.4); }
  .lead-form .input:focus { border-color:var(--gold); }

  /* FOOTER */
  footer {
    background:var(--navy); color:rgba(255,255,255,.6);
    padding:56px 0 28px;
  }
  .footer-logo {
    font-family:var(--serif); color:var(--gold); font-size:22px; font-weight:700;
    margin-bottom:12px;
  }
  .footer-tagline { font-size:13px; max-width:240px; line-height:1.6; }
  .footer-heading { color:rgba(255,255,255,.85); font-size:13px; font-weight:700;
    letter-spacing:1px; text-transform:uppercase; margin-bottom:16px; }
  .footer-link {
    display:block; font-size:13px; color:rgba(255,255,255,.5); padding:4px 0;
    cursor:pointer; transition:color .2s;
    background:none; border:none; text-align:left; font-family:var(--sans);
  }
  .footer-link:hover { color:var(--gold); }
  .footer-bottom {
    border-top:1px solid rgba(255,255,255,.08); margin-top:40px; padding-top:24px;
    display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;
    font-size:12px;
  }

  /* PAGE HERO */
  .page-hero {
    background:var(--navy); padding:56px 0 48px; text-align:center;
    border-bottom:1px solid rgba(201,168,76,.15);
  }
  .page-hero h1 {
    font-family:var(--serif); color:var(--white); font-size:40px;
    font-weight:700; margin-bottom:10px;
  }
  .page-hero h1 em { color:var(--gold); font-style:italic; }
  .page-hero p { color:rgba(255,255,255,.6); font-size:16px; }

  /* CART SIDEBAR */
  .cart-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.5);
    z-index:200; display:flex; justify-content:flex-end;
  }
  .cart-panel {
    background:var(--white); width:100%; max-width:420px;
    height:100%; overflow-y:auto;
    display:flex; flex-direction:column;
    animation:slideIn .3s ease;
  }
  .cart-header {
    padding:20px 24px; background:var(--navy); color:var(--white);
    display:flex; align-items:center; justify-content:space-between;
  }
  .cart-header h3 { font-family:var(--serif); font-size:19px; color:var(--gold); }
  .cart-items { flex:1; padding:20px 24px; overflow-y:auto; }
  .cart-item {
    display:flex; gap:14px; padding:14px 0;
    border-bottom:1px solid var(--border); align-items:flex-start;
  }
  .cart-item-icon {
    width:52px; height:52px; border-radius:8px;
    background:var(--cream2); display:flex; align-items:center;
    justify-content:center; font-size:24px; flex-shrink:0;
  }
  .cart-item-name { font-size:14px; font-weight:600; color:var(--navy); margin-bottom:2px; }
  .cart-item-price { font-size:15px; font-weight:700; color:var(--gold); }
  .cart-footer {
    padding:20px 24px;
    border-top:2px solid var(--border);
    background:var(--cream);
  }
  .cart-total-row {
    display:flex; justify-content:space-between; align-items:center;
    margin-bottom:16px;
  }
  .cart-total-label { font-size:16px; font-weight:600; color:var(--navy); }
  .cart-total-val { font-family:var(--serif); font-size:24px; font-weight:700; color:var(--navy); }

  /* CHECKOUT MODAL */
  .modal-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:300;
    display:flex; align-items:center; justify-content:center; padding:24px;
  }
  .modal {
    background:var(--white); border-radius:20px;
    width:100%; max-width:500px; overflow:hidden;
    box-shadow:var(--shadow-lg);
    animation:fadeUp .3s ease;
  }
  .modal-header {
    background:var(--navy); padding:20px 24px;
    display:flex; align-items:center; justify-content:space-between;
  }
  .modal-header h3 { font-family:var(--serif); color:var(--gold); font-size:19px; }
  .modal-body { padding:24px; }
  .modal-footer { padding:0 24px 24px; }

  /* PAYMENT METHOD BUTTONS */
  .pay-btn {
    width:100%; padding:14px; border-radius:10px; border:none;
    font-family:var(--sans); font-size:15px; font-weight:600;
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
    transition:all .2s; margin-bottom:10px;
  }
  .pay-stripe { background:#635bff; color:white; }
  .pay-stripe:hover { background:#4c45d6; }
  .pay-apple { background:#000; color:white; }
  .pay-apple:hover { background:#333; }
  .pay-google { background:white; color:#444; border:1.5px solid #ddd; }
  .pay-google:hover { background:#f8f8f8; }

  /* TABS */
  .tabs { display:flex; gap:4px; padding:4px; background:var(--cream2); border-radius:10px; }
  .tab {
    flex:1; padding:9px 16px; border-radius:8px; border:none;
    font-family:var(--sans); font-size:13.5px; font-weight:500; cursor:pointer;
    transition:all .2s; color:var(--muted); background:none;
  }
  .tab.active { background:var(--white); color:var(--navy); font-weight:600; box-shadow:0 2px 8px rgba(0,0,0,.08); }

  /* FILTER PILLS */
  .filter-pills { display:flex; gap:8px; flex-wrap:wrap; }
  .pill {
    padding:7px 16px; border-radius:20px; border:1.5px solid var(--border);
    font-size:13px; font-weight:500; cursor:pointer; background:var(--white);
    color:var(--muted); transition:all .2s;
  }
  .pill.active { background:var(--navy); color:var(--gold); border-color:var(--navy); }
  .pill:hover:not(.active) { border-color:var(--gold); color:var(--gold); }

  /* BOOKING */
  .time-slot {
    padding:10px 12px; border-radius:8px; border:1.5px solid var(--border);
    font-size:13px; font-weight:500; cursor:pointer; text-align:center;
    transition:all .2s; background:var(--white); color:var(--muted);
  }
  .time-slot:hover { border-color:var(--gold); color:var(--gold); }
  .time-slot.selected { background:var(--navy); color:var(--gold); border-color:var(--navy); }
  .time-slot.unavailable { opacity:.4; cursor:not-allowed; }

  /* SEARCH */
  .search-wrap { position:relative; }
  .search-wrap input { padding-left:40px; }
  .search-icon {
    position:absolute; left:12px; top:50%; transform:translateY(-50%);
    color:var(--muted); font-size:16px; pointer-events:none;
  }

  /* PROGRESS */
  .progress { height:6px; background:var(--cream2); border-radius:3px; overflow:hidden; margin-top:6px; }
  .progress-bar { height:100%; border-radius:3px; background:linear-gradient(90deg,var(--gold),var(--gold2)); transition:width .3s; }

  /* STAR RATING */
  .stars { color:var(--gold); font-size:14px; letter-spacing:1px; }

  /* ALERT */
  .alert {
    padding:12px 16px; border-radius:10px;
    font-size:14px; display:flex; align-items:flex-start; gap:10px;
  }
  .alert-info { background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; }
  .alert-success { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }

  /* DOWNLOAD ITEM */
  .download-item {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 18px; background:var(--white); border:1px solid var(--border);
    border-radius:10px; margin-bottom:10px;
  }
  .download-icon {
    width:40px; height:40px; border-radius:8px;
    background:linear-gradient(135deg, var(--cream), var(--cream2));
    display:flex; align-items:center; justify-content:center; font-size:20px;
    flex-shrink:0;
  }

  /* SCROLL TOP */
  .scroll-top {
    position:fixed; bottom:24px; left:24px; z-index:50;
    width:40px; height:40px; border-radius:50%;
    background:var(--navy); color:var(--gold);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; font-size:18px; border:1px solid rgba(201,168,76,.3);
    transition:all .2s; box-shadow:var(--shadow);
  }
  .scroll-top:hover { background:var(--navy2); transform:translateY(-2px); }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:1, title:"London Relocation Starter Guide", desc:"68-page complete relocation manual covering housing, banking, NHS, utilities & more.", cat:"relocation", emoji:"📦", price:19.99, oldPrice:29.99, badge:"Bestseller", pages:"68 pages", rating:4.9, reviews:247, downloads:1842 },
  { id:2, title:"First 30 Days in London", desc:"Day-by-day action plan for your first month — never feel lost or overwhelmed.", cat:"relocation", emoji:"📅", price:14.99, badge:"Popular", pages:"44 pages", rating:4.8, reviews:183 },
  { id:3, title:"UK Banking Setup Guide", desc:"Open a UK bank account as a newcomer — Monzo, Starling, Lloyds & Barclays compared.", cat:"relocation", emoji:"🏦", price:9.99, pages:"28 pages", rating:4.7, reviews:142 },
  { id:4, title:"London Accommodation Guide", desc:"Find the right area, negotiate rent, avoid scams — complete housing guide.", cat:"relocation", emoji:"🏠", price:12.99, pages:"52 pages", rating:4.8, reviews:198 },
  { id:5, title:"Hidden London Walks", desc:"12 secret walking routes away from tourists — including maps and points of interest.", cat:"travel", emoji:"🚶", price:11.99, badge:"New", pages:"38 pages", rating:4.9, reviews:89 },
  { id:6, title:"Weekend London Itineraries", desc:"8 curated weekend plans across all budgets — families, couples, solo travellers.", cat:"travel", emoji:"🗓️", price:8.99, pages:"32 pages", rating:4.7, reviews:74 },
  { id:7, title:"Budget London Travel Guide", desc:"See everything London has to offer for under £50 per day — pro tips included.", cat:"travel", emoji:"💷", price:7.99, pages:"24 pages", rating:4.6, reviews:96 },
  { id:8, title:"London Photography Spot Map", desc:"150+ photography locations with GPS coordinates, best times, and camera settings.", cat:"photography", emoji:"📸", price:12.99, badge:"Top Rated", pages:"60 pages", rating:5.0, reviews:211 },
  { id:9, title:"Instagram Locations Guide", desc:"The most iconic and hidden Instagram-worthy spots — with exact location pins.", cat:"photography", emoji:"📷", price:9.99, pages:"34 pages", rating:4.8, reviews:154 },
  { id:10, title:"Night Photography Guide", desc:"Long exposure, light trails, city skylines — master London after dark.", cat:"photography", emoji:"🌃", price:10.99, pages:"40 pages", rating:4.9, reviews:127 },
  { id:11, title:"UK CV Template Bundle", desc:"5 ATS-optimised CV templates + 3 cover letter templates for the UK job market.", cat:"jobs", emoji:"📄", price:9.99, badge:"Value", pages:"Templates", rating:4.8, reviews:312 },
  { id:12, title:"Cover Letter Bundle", desc:"20 professionally written cover letter templates across 10 industries.", cat:"jobs", emoji:"✉️", price:7.99, pages:"Templates", rating:4.7, reviews:189 },
  { id:13, title:"Job Search Toolkit", desc:"LinkedIn optimisation, interview prep, salary negotiation — your complete UK job guide.", cat:"jobs", emoji:"🧳", price:17.99, oldPrice:24.99, badge:"Bundle", pages:"80 pages", rating:4.9, reviews:267 },
];

const BLOG_POSTS = [
  { id:1, emoji:"🏘️", cat:"Housing", readTime:"6 min", title:"Best Areas to Live in London for New Arrivals in 2024", excerpt:"We compare East, South, North and West London across commute time, average rent, safety ratings and community vibe.", date:"Nov 15, 2024" },
  { id:2, emoji:"💷", cat:"Finance", readTime:"8 min", title:"The Real Cost of Living in London (2024 Numbers)", excerpt:"A realistic breakdown of what you'll spend every month — rent, food, transport, entertainment and emergency savings.", date:"Nov 8, 2024" },
  { id:3, emoji:"🏦", cat:"Banking", readTime:"5 min", title:"UK Bank Accounts for New Arrivals: The 2024 Guide", excerpt:"Monzo vs Starling vs Barclays vs HSBC — which account can you open without UK credit history? We tested them all.", date:"Oct 29, 2024" },
  { id:4, emoji:"🎓", cat:"Student Life", readTime:"7 min", title:"International Student Guide to London 2024/25", excerpt:"Student accommodation, NHS registration, transport discounts, part-time work rights and social life on a student budget.", date:"Oct 20, 2024" },
  { id:5, emoji:"🛂", cat:"Immigration", readTime:"10 min", title:"Skilled Worker Visa to Settlement: Your Complete Timeline", excerpt:"From BRP collection to ILR application — key dates, UKVI requirements, English test requirements, and common pitfalls.", date:"Oct 12, 2024" },
  { id:6, emoji:"🚇", cat:"Transport", readTime:"4 min", title:"The Complete TfL Guide for London Newcomers", excerpt:"Oyster vs Contactless, zone pricing explained, Night Tube map, bus routes and how to avoid peak fares.", date:"Oct 5, 2024" },
];

const TESTIMONIALS = [
  { name:"Priya Sharma", from:"Mumbai → London", text:"The Relocation Starter Guide saved me weeks of confusion. I had my bank account, NI number and NHS GP all sorted in the first 10 days.", emoji:"🇮🇳" },
  { name:"Adebayo Okonkwo", from:"Lagos → London", text:"As a Skilled Worker visa holder, the banking guide was invaluable. Opened my Monzo in the airport queue!", emoji:"🇳🇬" },
  { name:"Tanvir Ahmed", from:"Dhaka → London", text:"Booked the Gold consultation before moving and it was worth every penny. My consultant helped with my accommodation search remotely.", emoji:"🇧🇩" },
  { name:"Fatima Malik", from:"Karachi → London", text:"The photography map is genuinely stunning — found spots I've never seen on Instagram. Worth it for the Bankside alone.", emoji:"🇵🇰" },
];

// ─── LONDON SKYLINE SVG ────────────────────────────────────────────────────────
function SkylineSVG() {
  return (
    <svg viewBox="0 0 1400 180" xmlns="http://www.w3.org/2000/svg" style={{width:"1400px",height:"180px",flexShrink:0}}>
      {/* Big Ben */}
      <rect x="60" y="30" width="12" height="150" fill="rgba(201,168,76,.15)"/>
      <rect x="55" y="20" width="22" height="10" fill="rgba(201,168,76,.15)"/>
      <rect x="63" y="8" width="6" height="12" fill="rgba(201,168,76,.2)"/>
      <rect x="65" y="2" width="2" height="6" fill="rgba(201,168,76,.3)"/>
      {/* Parliament */}
      <rect x="90" y="80" width="120" height="100" fill="rgba(201,168,76,.08)"/>
      <rect x="90" y="60" width="10" height="20" fill="rgba(201,168,76,.12)"/>
      <rect x="108" y="65" width="8" height="15" fill="rgba(201,168,76,.12)"/>
      <rect x="125" y="60" width="8" height="20" fill="rgba(201,168,76,.12)"/>
      {/* Tower of London */}
      <rect x="240" y="90" width="80" height="90" fill="rgba(255,255,255,.05)"/>
      <rect x="240" y="70" width="15" height="20" fill="rgba(255,255,255,.07)"/>
      <rect x="305" y="70" width="15" height="20" fill="rgba(255,255,255,.07)"/>
      {/* The Shard */}
      <polygon points="360,180 390,180 385,10 365,10" fill="rgba(201,168,76,.1)"/>
      <polygon points="363,60 387,60 381,15 369,15" fill="rgba(201,168,76,.15)"/>
      {/* Gherkin */}
      <ellipse cx="440" cy="100" rx="20" ry="80" fill="rgba(255,255,255,.06)"/>
      {/* NatWest Tower */}
      <rect x="480" y="50" width="28" height="130" fill="rgba(255,255,255,.05)"/>
      <rect x="490" y="40" width="8" height="10" fill="rgba(255,255,255,.08)"/>
      {/* Canary Wharf */}
      <rect x="540" y="40" width="40" height="140" fill="rgba(201,168,76,.08)"/>
      <rect x="551" y="32" width="18" height="8" fill="rgba(201,168,76,.12)"/>
      <rect x="558" y="20" width="4" height="12" fill="rgba(201,168,76,.2)"/>
      {/* Walkie Talkie */}
      <rect x="610" y="70" width="50" height="110" fill="rgba(255,255,255,.04)" rx="4"/>
      <rect x="608" y="60" width="54" height="10" fill="rgba(255,255,255,.06)" rx="2"/>
      {/* Cheesegrater */}
      <polygon points="690,180 720,180 700,30" fill="rgba(255,255,255,.05)"/>
      {/* Broadgate Tower */}
      <rect x="740" y="55" width="32" height="125" fill="rgba(201,168,76,.07)"/>
      {/* St Paul's */}
      <rect x="800" y="100" width="70" height="80" fill="rgba(255,255,255,.05)"/>
      <ellipse cx="835" cy="90" rx="28" ry="18" fill="rgba(255,255,255,.07)"/>
      <rect x="832" y="60" width="6" height="30" fill="rgba(255,255,255,.1)"/>
      {/* Tate Modern chimney */}
      <rect x="910" y="20" width="16" height="160" fill="rgba(255,255,255,.06)"/>
      <rect x="905" y="80" width="26" height="100" fill="rgba(255,255,255,.04)"/>
      {/* Blackfriars */}
      <rect x="960" y="90" width="45" height="90" fill="rgba(201,168,76,.06)"/>
      {/* City skyline filler */}
      <rect x="1030" y="110" width="30" height="70" fill="rgba(255,255,255,.04)"/>
      <rect x="1070" y="80" width="25" height="100" fill="rgba(255,255,255,.04)"/>
      <rect x="1105" y="95" width="40" height="85" fill="rgba(255,255,255,.04)"/>
      <rect x="1155" y="70" width="20" height="110" fill="rgba(201,168,76,.06)"/>
      <rect x="1185" y="100" width="35" height="80" fill="rgba(255,255,255,.04)"/>
      <rect x="1230" y="85" width="22" height="95" fill="rgba(255,255,255,.04)"/>
      <rect x="1262" y="60" width="18" height="120" fill="rgba(201,168,76,.07)"/>
      <rect x="1290" y="110" width="28" height="70" fill="rgba(255,255,255,.04)"/>
      <rect x="1328" y="90" width="32" height="90" fill="rgba(255,255,255,.04)"/>
      <rect x="1370" y="75" width="20" height="105" fill="rgba(201,168,76,.06)"/>
      {/* Thames */}
      <rect x="0" y="165" width="1400" height="15" fill="rgba(201,168,76,.05)"/>
    </svg>
  );
}

// ─── SUBCOMPONENTS ─────────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="toast">
      <span style={{fontSize:18}}>✓</span>
      <span>{message}</span>
    </div>
  );
}

function Logo({ onClick }) {
  return (
    <div className="nav-logo" onClick={onClick}>
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="8" fill="rgba(201,168,76,.15)"/>
        <rect x="5" y="20" width="22" height="3" fill="#c9a84c" rx="1"/>
        <rect x="8" y="9" width="2.5" height="11" fill="#c9a84c"/>
        <rect x="13" y="12" width="2.5" height="8" fill="#c9a84c"/>
        <rect x="18" y="7" width="2.5" height="13" fill="#c9a84c"/>
        <rect x="23" y="13" width="2.5" height="7" fill="#c9a84c"/>
        <path d="M7 9 L9.75 7 L15.25 12 L19.25 6 L24.25 10" stroke="#e2c97e" fill="none" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      London Lens
    </div>
  );
}

function StarRating({ rating }) {
  return <span className="stars">{"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}</span>;
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, cartCount, openCart }) {
  const links = [
    { id:"products", label:"Products" },
    { id:"consultations", label:"Consultations" },
    { id:"tools", label:"Tools" },
    { id:"blog", label:"Blog" },
    { id:"membership", label:"Membership" },
  ];
  return (
    <nav className="main-nav">
      <div className="container">
        <div className="nav-inner">
          <Logo onClick={() => setPage("home")} />
          <div className="nav-links">
            {links.map(l => (
              <button key={l.id} className={`nav-link${page===l.id?" active":""}`} onClick={() => setPage(l.id)}>{l.label}</button>
            ))}
            <button className="nav-link" onClick={() => setPage("dashboard")}>Dashboard</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div className="nav-cart" onClick={openCart}>
              🛒 Cart
              {cartCount > 0 && <span className="cart-bubble">{cartCount}</span>}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── CART SIDEBAR ─────────────────────────────────────────────────────────────
function CartSidebar({ cart, onClose, onRemove, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.price, 0);
  return (
    <div className="cart-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="cart-panel">
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button style={{background:"none",border:"none",color:"rgba(255,255,255,.6)",fontSize:20,cursor:"pointer"}} onClick={onClose}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 && (
            <div style={{textAlign:"center",padding:"40px 0",color:"var(--muted)"}}>
              <div style={{fontSize:48,marginBottom:12}}>🛒</div>
              <p>Your cart is empty</p>
              <p style={{fontSize:13,marginTop:4}}>Browse our products to get started</p>
            </div>
          )}
          {cart.map(item => (
            <div key={item.cartId} className="cart-item">
              <div className="cart-item-icon">{item.emoji}</div>
              <div style={{flex:1}}>
                <div className="cart-item-name">{item.title}</div>
                <div className="cart-item-price">£{item.price.toFixed(2)}</div>
              </div>
              <button onClick={() => onRemove(item.cartId)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18,padding:"4px"}}>✕</button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-val">£{total.toFixed(2)}</span>
            </div>
            <button className="btn btn-gold btn-full btn-lg" onClick={onCheckout}>
              Proceed to Checkout →
            </button>
            <p style={{textAlign:"center",fontSize:12,color:"var(--muted)",marginTop:10}}>
              🔒 Secure payment · Stripe · Apple Pay · Google Pay
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CHECKOUT MODAL ───────────────────────────────────────────────────────────
function CheckoutModal({ cart, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const total = cart.reduce((s, i) => s + i.price, 0);

  const handlePay = () => {
    if (!name || !email) return;
    setTimeout(() => { setStep(3); }, 1200);
    setStep(2);
  };

  if (step === 3) return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onSuccess()}>
      <div className="modal">
        <div style={{padding:"48px",textAlign:"center"}}>
          <div style={{fontSize:56,marginBottom:16}}>🎉</div>
          <h3 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--navy)",marginBottom:8}}>Payment Successful!</h3>
          <p style={{color:"var(--muted)",marginBottom:24,fontSize:15}}>Your downloads are ready in your dashboard. A confirmation email has been sent.</p>
          <button className="btn btn-gold btn-lg" onClick={onSuccess}>Go to Dashboard →</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Checkout</h3>
          <button style={{background:"none",border:"none",color:"rgba(255,255,255,.6)",fontSize:20,cursor:"pointer"}} onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{marginBottom:20}}>
            {cart.map(item => (
              <div key={item.cartId} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)",fontSize:14}}>
                <span>{item.emoji} {item.title}</span>
                <span style={{fontWeight:700,color:"var(--navy)"}}>£{item.price.toFixed(2)}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",fontWeight:700,fontSize:16}}>
              <span>Total</span>
              <span style={{color:"var(--navy)",fontFamily:"var(--serif)",fontSize:20}}>£{total.toFixed(2)}</span>
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:13,color:"var(--muted)",display:"block",marginBottom:5}}>Full Name</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" />
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:13,color:"var(--muted)",display:"block",marginBottom:5}}>Email Address</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          {step === 2 && <div style={{textAlign:"center",padding:"16px 0",color:"var(--muted)"}}>
            <div style={{animation:"pulse 1s infinite",fontSize:14}}>Processing payment…</div>
          </div>}
        </div>
        <div className="modal-footer">
          <button className="pay-btn pay-stripe" onClick={handlePay} disabled={step===2}>
            💳 Pay with Stripe — £{total.toFixed(2)}
          </button>
          <button className="pay-btn pay-apple" onClick={handlePay} disabled={step===2}>
             Pay with Apple Pay
          </button>
          <button className="pay-btn pay-google" onClick={handlePay} disabled={step===2}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google Pay
          </button>
          <p style={{textAlign:"center",fontSize:11,color:"var(--muted)",marginTop:8}}>
            🔒 256-bit SSL encryption · Stripe UK · No card details stored
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAdd, onView, inCart }) {
  return (
    <div className="card" onClick={() => onView(product)}>
      <div className="product-img-wrap" style={{background:`linear-gradient(135deg,${catColors[product.cat][0]},${catColors[product.cat][1]})`}}>
        <span>{product.emoji}</span>
        {product.badge && <span className="cat-badge badge badge-navy product-img-wrap">{product.badge}</span>}
        <span className="badge badge-gold sale-badge" style={{position:"absolute",top:10,left:10}}>{product.cat}</span>
      </div>
      <div className="product-body">
        <div className="product-title">{product.title}</div>
        <div className="product-desc">{product.desc}</div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:12,display:"flex",gap:12,alignItems:"center"}}>
          <StarRating rating={product.rating} />
          <span>({product.reviews})</span>
          {product.pages && <span>· {product.pages}</span>}
        </div>
        <div className="product-meta">
          <div>
            {product.oldPrice && <span className="product-price-old">£{product.oldPrice}</span>}
            <span className="product-price">£{product.price}</span>
          </div>
          <button
            className={`btn btn-sm ${inCart ? "btn-ghost" : "btn-navy"}`}
            onClick={e => { e.stopPropagation(); if (!inCart) onAdd(product); }}
          >
            {inCart ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

const catColors = {
  relocation: ["#eef4ff","#dce8ff"],
  travel: ["#f0fff4","#dcf5e7"],
  photography: ["#fff0f4","#fde8ec"],
  jobs: ["#fffbf0","#fef3d0"],
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ onAddToCart, cart, setPage, onLeadSubmit }) {
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const featured = PRODUCTS.filter(p => p.badge);

  const handleLead = () => {
    if (leadEmail) { setLeadSubmitted(true); onLeadSubmit(leadEmail); }
  };

  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div className="hero-grain"/>
        <div className="hero-glow"/>
        <div className="hero-skyline">
          <div className="skyline-track">
            <SkylineSVG/><SkylineSVG/>
          </div>
        </div>
        <div className="container hero-content">
          <div className="fade-up">
            <div className="hero-eyebrow">
              <span style={{width:6,height:6,borderRadius:"50%",background:"var(--gold)",display:"inline-block"}}/>
              London Relocation Platform
            </div>
          </div>
          <h1 className="fade-up fade-up-1">
            Your Guide to<br/><em>Living & Thriving</em><br/>in London
          </h1>
          <p className="hero-sub fade-up fade-up-2">
            Trusted digital resources, expert consultations and interactive tools
            for newcomers from Bangladesh, India, Pakistan, Nigeria and beyond.
          </p>
          <div className="hero-actions fade-up fade-up-3">
            <button className="btn btn-gold btn-lg" onClick={() => setPage("products")}>
              Browse Products →
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => setPage("consultations")}>
              Book Consultation
            </button>
          </div>
          <div className="hero-trust fade-up fade-up-4">
            {[
              "12,400+ Newcomers Helped",
              "Secure UK Payments",
              "Instant Downloads",
              "4.9★ Rated Platform",
            ].map(t => (
              <div key={t} className="trust-item">
                <span className="trust-dot"/>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section-sm" style={{background:"var(--white)",borderBottom:"1px solid var(--border)"}}>
        <div className="container">
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            {[
              {emoji:"🗺️",cat:"relocation",label:"Relocation",count:4},
              {emoji:"✈️",cat:"travel",label:"Travel",count:3},
              {emoji:"📸",cat:"photography",label:"Photography",count:3},
              {emoji:"💼",cat:"jobs",label:"Job Search",count:3},
            ].map(c => (
              <div key={c.cat}
                onClick={() => setPage("products")}
                style={{
                  background:"var(--cream)", borderRadius:12, padding:"20px 16px",
                  textAlign:"center", cursor:"pointer", border:"1px solid var(--border)",
                  transition:"all .2s"
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="";}}
              >
                <div style={{fontSize:32,marginBottom:8}}>{c.emoji}</div>
                <div style={{fontWeight:600,fontSize:15,color:"var(--navy)",marginBottom:2}}>{c.label}</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>{c.count} products</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section" style={{background:"var(--cream)"}}>
        <div className="container">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
            <div className="section-header" style={{marginBottom:0}}>
              <div className="eyebrow">Featured</div>
              <h2 style={{marginBottom:0}}>Most Popular Products</h2>
            </div>
            <button className="btn btn-ghost" onClick={() => setPage("products")}>View All →</button>
          </div>
          <div className="grid-4">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} onAdd={onAddToCart} onView={() => setPage("products")}
                inCart={cart.some(c => c.id === p.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* LEAD MAGNET */}
      <section className="section-sm" style={{background:"var(--cream2)"}}>
        <div className="container-sm">
          <div className="lead-box">
            <div style={{position:"relative",zIndex:1}}>
              <div style={{fontSize:40,marginBottom:12}}>🎁</div>
              <h3>Free: London Arrival Checklist</h3>
              <p>Our 47-point checklist used by 8,000+ new arrivals — covering your first week, month and 3 months in London. Completely free.</p>
              {leadSubmitted ? (
                <div className="alert alert-success" style={{maxWidth:400,margin:"0 auto",justifyContent:"center"}}>
                  ✓ Check your inbox! Your checklist is on the way.
                </div>
              ) : (
                <div className="lead-form">
                  <input className="input" placeholder="Your email address" value={leadEmail}
                    onChange={e=>setLeadEmail(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&handleLead()} />
                  <button className="btn btn-gold" onClick={handleLead}>Get Free Guide</button>
                </div>
              )}
              <p style={{fontSize:11,color:"rgba(255,255,255,.3)",marginTop:12}}>No spam. Unsubscribe anytime. GDPR compliant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{background:"var(--white)"}}>
        <div className="container">
          <div className="section-header" style={{textAlign:"center"}}>
            <div className="eyebrow">Testimonials</div>
            <h2>Trusted by Thousands of New Londoners</h2>
          </div>
          <div className="grid-4">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card-flat" style={{padding:"24px"}}>
                <div className="stars" style={{marginBottom:10}}>★★★★★</div>
                <p style={{fontSize:14,color:"var(--ink)",lineHeight:1.7,marginBottom:16,fontStyle:"italic"}}>"{t.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"var(--cream2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{t.emoji}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--navy)"}}>{t.name}</div>
                    <div style={{fontSize:12,color:"var(--muted)"}}>{t.from}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSULTATION CTA */}
      <section className="section" style={{background:"var(--navy)"}}>
        <div className="container" style={{textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:16}}>🎓</div>
          <h2 style={{fontFamily:"var(--serif)",color:"var(--white)",fontSize:34,marginBottom:12}}>
            Expert <em style={{color:"var(--gold)",fontStyle:"italic"}}>1-to-1</em> Consultations
          </h2>
          <p style={{color:"rgba(255,255,255,.6)",fontSize:16,maxWidth:480,margin:"0 auto 28px",lineHeight:1.7}}>
            Book a video session with a London relocation specialist. Skilled Worker visa, housing, banking, education — whatever you need.
          </p>
          <button className="btn btn-gold btn-lg" onClick={() => setPage("consultations")}>
            Book a Consultation →
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────
function ProductsPage({ onAddToCart, cart }) {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");

  let items = PRODUCTS.filter(p => {
    if (cat !== "all" && p.cat !== cat) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  if (sort === "price-asc") items = [...items].sort((a,b) => a.price-b.price);
  if (sort === "price-desc") items = [...items].sort((a,b) => b.price-a.price);
  if (sort === "rating") items = [...items].sort((a,b) => b.rating-a.rating);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Digital <em>Marketplace</em></h1>
          <p>Downloadable guides, maps, templates & toolkits — instantly delivered after purchase</p>
        </div>
      </div>
      <section className="section" style={{background:"var(--cream)"}}>
        <div className="container">
          <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap",alignItems:"center"}}>
            <div className="search-wrap" style={{flex:1,minWidth:200}}>
              <span className="search-icon">🔍</span>
              <input className="input" placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <select className="select" style={{width:160}} value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}>
            {["all","relocation","travel","photography","jobs"].map(c => (
              <div key={c} className={`pill${cat===c?" active":""}`} onClick={()=>setCat(c)}>
                {c==="all"?"All Products":c.charAt(0).toUpperCase()+c.slice(1)}
              </div>
            ))}
          </div>
          <div style={{marginBottom:16,fontSize:13,color:"var(--muted)"}}>
            Showing {items.length} product{items.length!==1?"s":""}
          </div>
          {items.length === 0 ? (
            <div style={{textAlign:"center",padding:"60px 0",color:"var(--muted)"}}>
              <div style={{fontSize:48,marginBottom:12}}>🔍</div>
              <p>No products found. Try a different search.</p>
            </div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20}}>
              {items.map(p => (
                <ProductCard key={p.id} product={p} onAdd={onAddToCart} onView={() => {}} inCart={cart.some(c=>c.id===p.id)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── CONSULTATIONS PAGE ───────────────────────────────────────────────────────
function ConsultationsPage({ onAddToCart, cart }) {
  const [selected, setSelected] = useState("silver");
  const [slot, setSlot] = useState(null);
  const [booked, setBooked] = useState(false);

  const tiers = [
    { id:"bronze", name:"Bronze", mins:30, price:49, features:["Introductory consultation","Q&A session","Resource pack PDF","Email summary"] },
    { id:"silver", name:"Silver", mins:60, price:89, popular:true, features:["Full consultation","Personal action plan","Follow-up email","Resource bundle","Priority booking"] },
    { id:"gold",   name:"Gold",   mins:90, price:129, features:["Deep-dive session","Document review","30-day email support","Premium resource pack","Video recording","WhatsApp access"] },
  ];

  const slots = [
    { id:"mon-9", label:"Mon 9:00am", available:true },
    { id:"mon-2", label:"Mon 2:00pm", available:true },
    { id:"tue-10",label:"Tue 10:00am",available:true },
    { id:"tue-3", label:"Tue 3:00pm", available:false },
    { id:"wed-11",label:"Wed 11:00am",available:true },
    { id:"wed-4", label:"Wed 4:00pm", available:true },
    { id:"thu-9", label:"Thu 9:00am", available:true },
    { id:"thu-2", label:"Thu 2:00pm", available:false },
    { id:"fri-10",label:"Fri 10:00am",available:true },
  ];

  const tier = tiers.find(t => t.id === selected);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Expert <em>Consultations</em></h1>
          <p>One-to-one video sessions with London relocation specialists</p>
        </div>
      </div>
      <section className="section" style={{background:"var(--cream)"}}>
        <div className="container">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,marginBottom:40}}>
            {tiers.map(t => (
              <div key={t.id} className={`consult-card${selected===t.id?" selected":""}`} onClick={()=>setSelected(t.id)}>
                {t.popular && <div className="consult-popular">Most Popular</div>}
                <div className="consult-tier">{t.name}</div>
                <div className="consult-duration">{t.mins} minutes · Video call</div>
                <div className="consult-price">£{t.price}</div>
                <ul className="consult-features">
                  {t.features.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div style={{background:"var(--white)",border:"1px solid var(--border)",borderRadius:14,padding:28,marginBottom:24}}>
            <h3 style={{fontFamily:"var(--serif)",fontSize:18,color:"var(--navy)",marginBottom:16}}>
              Choose a Time Slot
            </h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {slots.map(s => (
                <div key={s.id}
                  className={`time-slot${!s.available?" unavailable":""}${slot===s.id?" selected":""}`}
                  onClick={() => s.available && setSlot(slot===s.id?null:s.id)}>
                  {s.label}
                  {!s.available && <div style={{fontSize:10,color:"var(--muted)"}}>Booked</div>}
                </div>
              ))}
            </div>
          </div>

          {booked ? (
            <div className="alert alert-success" style={{fontSize:15,marginBottom:24}}>
              ✓ Booking confirmed! You'll receive a Zoom link and confirmation to your email.
            </div>
          ) : (
            <button
              className="btn btn-gold btn-lg btn-full"
              onClick={() => { if (slot) setBooked(true); }}
              style={{opacity:slot?1:.5,marginBottom:12}}
            >
              Book {tier.name} ({tier.mins} mins) — £{tier.price} →
            </button>
          )}
          <p style={{textAlign:"center",fontSize:12,color:"var(--muted)"}}>
            🔒 Payment via Stripe · Instant booking confirmation · Reschedule up to 24 hours before
          </p>

          <div style={{marginTop:40,borderTop:"1px solid var(--border)",paddingTop:40}}>
            <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--navy)",marginBottom:20}}>What Our Clients Say</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {TESTIMONIALS.slice(0,2).map(t => (
                <div key={t.name} style={{background:"var(--white)",border:"1px solid var(--border)",borderRadius:12,padding:20}}>
                  <div className="stars" style={{marginBottom:8}}>★★★★★</div>
                  <p style={{fontSize:13,fontStyle:"italic",color:"var(--ink)",marginBottom:12}}>"{t.text}"</p>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--navy)"}}>{t.name} — {t.from}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── TOOLS PAGE ───────────────────────────────────────────────────────────────
function ToolsPage() {
  const [rent, setRent] = useState(1500);
  const [food, setFood] = useState(400);
  const [transport, setTransport] = useState(130);
  const [utilities, setUtilities] = useState(100);
  const [income, setIncome] = useState(3500);
  const [fromZone, setFromZone] = useState(2);
  const [toZone, setToZone] = useState(1);

  const monthly = rent + food + transport + utilities;
  const surplus = income - monthly;

  const zoneMatrix = [
    [0,22,32,42,52,60],
    [22,0,16,26,36,46],
    [32,16,0,14,24,34],
    [42,26,14,0,12,22],
    [52,36,24,12,0,12],
    [60,46,34,22,12,0],
  ];
  const zoneCost = [
    [0,3.6,4.1,4.8,5.4,5.9],
    [3.6,0,3.1,3.7,4.2,4.8],
    [4.1,3.1,0,2.8,3.4,4.0],
    [4.8,3.7,2.8,0,2.6,3.2],
    [5.4,4.2,3.4,2.6,0,2.4],
    [5.9,4.8,4.0,3.2,2.4,0],
  ];

  const commuteTime = zoneMatrix[fromZone-1][toZone-1];
  const commuteCost = zoneCost[fromZone-1][toZone-1];
  const monthlyCommute = Math.round(commuteCost * 2 * 20);

  const RangeInput = ({ label, value, min, max, step, onChange, prefix="£" }) => {
    const pct = ((value-min)/(max-min)*100).toFixed(0);
    return (
      <div className="range-wrap">
        <div className="range-label">
          <span style={{color:"var(--muted)"}}>{label}</span>
          <span>{prefix}{value.toLocaleString()}</span>
        </div>
        <input type="range" min={min} max={max} step={step||50} value={value}
          style={{"--pct": pct+"%"}}
          onChange={e => onChange(+e.target.value)} />
      </div>
    );
  };

  const budgetCats = [
    {label:"Rent",val:rent,color:"#c9a84c"},
    {label:"Food",val:food,color:"#22c55e"},
    {label:"Transport",val:transport,color:"#3b82f6"},
    {label:"Utilities",val:utilities,color:"#f97316"},
    {label:"Surplus",val:Math.max(0,surplus),color:"#8b5cf6"},
  ];

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Interactive <em>London Tools</em></h1>
          <p>Free calculators to plan your life in London — 100% free, no sign-up required</p>
        </div>
      </div>
      <section className="section" style={{background:"var(--cream)"}}>
        <div className="container">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
            {/* COST OF LIVING */}
            <div className="tool-card">
              <h3>🏙️ Cost of Living Calculator</h3>
              <RangeInput label="Monthly Rent" value={rent} min={800} max={4000} step={50} onChange={setRent} />
              <RangeInput label="Food & Groceries" value={food} min={150} max={800} step={25} onChange={setFood} />
              <RangeInput label="Transport" value={transport} min={60} max={350} step={10} onChange={setTransport} />
              <RangeInput label="Utilities & Bills" value={utilities} min={60} max={400} step={10} onChange={setUtilities} />
              <div className="calc-result">
                <div className="calc-stat">
                  <div className="calc-val">£{monthly.toLocaleString()}</div>
                  <div className="calc-label">Monthly Cost</div>
                </div>
                <div className="calc-stat">
                  <div className="calc-val">£{(monthly*12).toLocaleString()}</div>
                  <div className="calc-label">Yearly Cost</div>
                </div>
              </div>
            </div>

            {/* COMMUTE FINDER */}
            <div className="tool-card">
              <h3>🚇 Commute Time Finder</h3>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:13,color:"var(--muted)",display:"block",marginBottom:6}}>From (Home Zone)</label>
                <select className="select" value={fromZone} onChange={e=>setFromZone(+e.target.value)}>
                  {[1,2,3,4,5,6].map(z=><option key={z} value={z}>Zone {z}{z===1?" (Central London)":""}</option>)}
                </select>
              </div>
              <div style={{marginBottom:20}}>
                <label style={{fontSize:13,color:"var(--muted)",display:"block",marginBottom:6}}>To (Work Zone)</label>
                <select className="select" value={toZone} onChange={e=>setToZone(+e.target.value)}>
                  {[1,2,3,4,5,6].map(z=><option key={z} value={z}>Zone {z}{z===1?" (Central London)":""}</option>)}
                </select>
              </div>
              <div className="calc-result" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
                <div className="calc-stat">
                  <div className="calc-val">{commuteTime}m</div>
                  <div className="calc-label">Travel Time</div>
                </div>
                <div className="calc-stat">
                  <div className="calc-val">£{commuteCost.toFixed(2)}</div>
                  <div className="calc-label">Single Fare</div>
                </div>
                <div className="calc-stat">
                  <div className="calc-val">£{monthlyCommute}</div>
                  <div className="calc-label">Monthly</div>
                </div>
              </div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:12,textAlign:"center"}}>
                Based on TfL Oyster/Contactless peak fares · 20 working days
              </div>
            </div>
          </div>

          {/* BUDGET PLANNER */}
          <div className="tool-card">
            <h3>📊 Monthly Budget Planner</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
              <div>
                <RangeInput label="Monthly Take-Home Income" value={income} min={1500} max={10000} step={100} onChange={setIncome} />
                <div style={{marginTop:24}}>
                  {budgetCats.map(c => (
                    <div key={c.label} style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                        <span style={{color:"var(--muted)"}}>{c.label}</span>
                        <span style={{fontWeight:600,color:"var(--navy)"}}>£{c.val.toLocaleString()} <span style={{color:"var(--muted)",fontWeight:400}}>({Math.round(c.val/income*100)}%)</span></span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar" style={{width:`${Math.min(100,c.val/income*100)}%`,background:c.color}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{background:"var(--navy)",borderRadius:12,padding:24,height:"100%",display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginBottom:20,textAlign:"center",letterSpacing:1,textTransform:"uppercase"}}>Monthly Summary</div>
                  {[
                    {label:"Income",val:`£${income.toLocaleString()}`,color:"var(--gold2)"},
                    {label:"Total Expenses",val:`£${monthly.toLocaleString()}`,color:"rgba(255,255,255,.7)"},
                    {label:"Monthly Surplus",val:`£${Math.max(0,surplus).toLocaleString()}`,color:surplus>=0?"#4ade80":"#f87171"},
                    {label:"Yearly Savings",val:`£${Math.max(0,surplus*12).toLocaleString()}`,color:surplus>=0?"#4ade80":"#f87171"},
                  ].map(r => (
                    <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
                      <span style={{fontSize:13,color:"rgba(255,255,255,.5)"}}>{r.label}</span>
                      <span style={{fontSize:16,fontWeight:700,color:r.color}}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── BLOG PAGE ────────────────────────────────────────────────────────────────
function BlogPage() {
  const [activeCat, setActiveCat] = useState("all");
  const cats = ["all","Housing","Finance","Banking","Student Life","Immigration","Transport"];
  const posts = activeCat==="all" ? BLOG_POSTS : BLOG_POSTS.filter(p=>p.cat===activeCat);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>London Lens <em>Blog</em></h1>
          <p>Expert articles for newcomers — housing, banking, transport, culture and community</p>
        </div>
      </div>
      <section className="section" style={{background:"var(--cream)"}}>
        <div className="container">
          <div style={{display:"flex",gap:8,marginBottom:32,flexWrap:"wrap"}}>
            {cats.map(c => (
              <div key={c} className={`pill${activeCat===c?" active":""}`} onClick={()=>setActiveCat(c)}>
                {c==="all"?"All Articles":c}
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
            {posts.map(p => (
              <div key={p.id} className="card blog-card">
                <div className="blog-img">{p.emoji}</div>
                <div className="blog-body">
                  <div className="blog-meta">
                    <span className="badge badge-gold">{p.cat}</span>
                    <span style={{marginLeft:8}}>{p.readTime} read · {p.date}</span>
                  </div>
                  <div className="blog-title">{p.title}</div>
                  <div className="blog-excerpt">{p.excerpt}</div>
                  <button className="btn btn-ghost btn-sm" style={{marginTop:14}}>Read Article →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── MEMBERSHIP PAGE ──────────────────────────────────────────────────────────
function MembershipPage() {
  const tiers = [
    {
      id:"free", name:"Free", price:0,
      features:[
        {text:"Blog access",yes:true},
        {text:"Free resources & tools",yes:true},
        {text:"Cost calculators",yes:true},
        {text:"All premium guides",yes:false},
        {text:"Exclusive maps",yes:false},
        {text:"New releases (early access)",yes:false},
        {text:"Consultation discounts",yes:false},
        {text:"Private community",yes:false},
      ]
    },
    {
      id:"premium", name:"Premium", price:12, featured:true,
      features:[
        {text:"Everything in Free",yes:true},
        {text:"All premium guides",yes:true},
        {text:"Exclusive borough maps",yes:true},
        {text:"New releases (early access)",yes:true},
        {text:"Email community",yes:true},
        {text:"Monthly consultation discount",yes:false},
        {text:"Private community access",yes:false},
        {text:"Live Q&A sessions",yes:false},
      ]
    },
    {
      id:"vip", name:"VIP", price:29,
      features:[
        {text:"Everything in Premium",yes:true},
        {text:"20% consultation discount",yes:true},
        {text:"Private community access",yes:true},
        {text:"Monthly live Q&A",yes:true},
        {text:"Priority email support",yes:true},
        {text:"Exclusive VIP resources",yes:true},
        {text:"Networking events access",yes:true},
        {text:"Personal area guide review",yes:true},
      ]
    },
  ];

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Membership <em>Plans</em></h1>
          <p>Unlock exclusive content, maps, discounts and community access</p>
        </div>
      </div>
      <section className="section" style={{background:"var(--cream)"}}>
        <div className="container">
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:40}}>
            {tiers.map(t => (
              <div key={t.id} className={`mem-card${t.featured?" featured":""}`}>
                {t.featured && <div style={{background:"var(--gold)",color:"var(--navy)",textAlign:"center",fontSize:11,fontWeight:700,padding:"4px 0",letterSpacing:1}}>MOST POPULAR</div>}
                <div className="mem-header">
                  <div className="mem-name">{t.name}</div>
                  <div className="mem-price">
                    {t.price===0?"Free":`£${t.price}`}
                    {t.price>0&&<span className="mem-period">/month</span>}
                  </div>
                  {t.price>0&&<div style={{fontSize:12,color:t.featured?"rgba(255,255,255,.4)":"var(--muted)",marginTop:4}}>Billed monthly · Cancel anytime</div>}
                </div>
                <ul className="mem-features">
                  {t.features.map(f => (
                    <li key={f.text}>
                      <span className={f.yes?"icon-yes":"icon-no"}>{f.yes?"✓":"✕"}</span>
                      <span style={{color:f.yes?"var(--ink)":"var(--muted)"}}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="mem-footer">
                  <button className={`btn btn-full btn-lg ${t.featured?"btn-gold":"btn-navy"}`}>
                    {t.price===0?"Get Started Free":"Start "+t.name+" →"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",padding:"20px",background:"var(--white)",borderRadius:12,border:"1px solid var(--border)",fontSize:13,color:"var(--muted)"}}>
            <span style={{fontSize:18,marginRight:8}}>💳</span>
            All subscriptions powered by Stripe · UK VAT included · Cancel anytime from your dashboard
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ purchases, leads }) {
  const [tab, setTab] = useState("downloads");

  const mockDownloads = purchases.length > 0 ? purchases : [
    {id:1, emoji:"📦", title:"London Relocation Starter Guide", date:"Nov 14, 2024", format:"PDF"},
    {id:2, emoji:"📅", title:"First 30 Days in London", date:"Nov 10, 2024", format:"PDF"},
  ];

  const mockConsults = [
    {id:1, tier:"Silver", date:"Nov 18, 2024", time:"2:00pm", status:"upcoming"},
    {id:2, tier:"Bronze", date:"Oct 25, 2024", time:"10:00am", status:"completed"},
  ];

  return (
    <div>
      <div className="page-hero">
        <div className="container" style={{textAlign:"left"}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:8}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(201,168,76,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>👤</div>
            <div>
              <h1 style={{fontSize:28,marginBottom:0}}>My <em>Dashboard</em></h1>
              <p style={{marginTop:4}}>Welcome back! Manage your purchases, downloads & consultations.</p>
            </div>
          </div>
        </div>
      </div>
      <section className="section" style={{background:"var(--cream)"}}>
        <div className="container">
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
            {[
              {label:"Products Purchased",val:mockDownloads.length,emoji:"📦"},
              {label:"Downloads Available",val:mockDownloads.length,emoji:"⬇️"},
              {label:"Consultations",val:mockConsults.length,emoji:"🎓"},
              {label:"Membership",val:"Free",emoji:"⭐"},
            ].map(s => (
              <div key={s.label} className="dash-stat">
                <div style={{fontSize:28,marginBottom:4}}>{s.emoji}</div>
                <div className="dash-stat-val">{s.val}</div>
                <div className="dash-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="tabs" style={{marginBottom:24,maxWidth:400}}>
            {["downloads","consultations","membership"].map(t => (
              <button key={t} className={`tab${tab===t?" active":""}`} onClick={()=>setTab(t)}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          {tab==="downloads" && (
            <div>
              <h3 style={{fontFamily:"var(--serif)",fontSize:18,color:"var(--navy)",marginBottom:16}}>Your Downloads</h3>
              {mockDownloads.map(d => (
                <div key={d.id} className="download-item">
                  <div className="download-icon">{d.emoji}</div>
                  <div style={{flex:1,marginLeft:14}}>
                    <div style={{fontSize:14,fontWeight:600,color:"var(--navy)"}}>{d.title}</div>
                    <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Purchased {d.date} · {d.format}</div>
                  </div>
                  <button className="btn btn-navy btn-sm">⬇ Download</button>
                </div>
              ))}
              <div className="alert alert-info" style={{marginTop:16}}>
                ℹ️ Download links are secure and expire after 30 days. Re-download any time from this page.
              </div>
            </div>
          )}

          {tab==="consultations" && (
            <div>
              <h3 style={{fontFamily:"var(--serif)",fontSize:18,color:"var(--navy)",marginBottom:16}}>Your Consultations</h3>
              {mockConsults.map(c => (
                <div key={c.id} className="download-item">
                  <div className="download-icon">🎓</div>
                  <div style={{flex:1,marginLeft:14}}>
                    <div style={{fontSize:14,fontWeight:600,color:"var(--navy)"}}>{c.tier} Consultation</div>
                    <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{c.date} at {c.time}</div>
                  </div>
                  <span className={`badge ${c.status==="upcoming"?"badge-navy":"badge-green"}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tab==="membership" && (
            <div>
              <h3 style={{fontFamily:"var(--serif)",fontSize:18,color:"var(--navy)",marginBottom:16}}>Your Membership</h3>
              <div style={{background:"var(--white)",border:"1px solid var(--border)",borderRadius:12,padding:24}}>
                <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
                  <div style={{fontSize:40}}>⭐</div>
                  <div>
                    <div style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--navy)"}}>Free Plan</div>
                    <div style={{fontSize:13,color:"var(--muted)"}}>Access to blog, tools & free resources</div>
                  </div>
                </div>
                <button className="btn btn-gold btn-lg">Upgrade to Premium — £12/mo →</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer>
      <div className="container">
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,marginBottom:0}}>
          <div>
            <div className="footer-logo">🏙️ London Lens</div>
            <p className="footer-tagline">Your trusted guide for relocating to London from Bangladesh, India, Pakistan, Nigeria and beyond.</p>
            <div style={{marginTop:16,display:"flex",gap:10}}>
              {["📘","🐦","📸","▶️"].map(s=>(
                <div key={s} style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer"}}>{s}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-heading">Platform</div>
            {["Products","Consultations","Tools","Membership","Blog"].map(l=>(
              <button key={l} className="footer-link" onClick={()=>setPage(l.toLowerCase())}>{l}</button>
            ))}
          </div>
          <div>
            <div className="footer-heading">Resources</div>
            {["London Guides","Banking Guide","Housing Tips","Visa Info","Job Search"].map(l=>(
              <button key={l} className="footer-link">{l}</button>
            ))}
          </div>
          <div>
            <div className="footer-heading">Company</div>
            {["About","Contact","FAQ","Privacy Policy","Terms"].map(l=>(
              <button key={l} className="footer-link">{l}</button>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 London Lens Ltd · Registered in England & Wales · All rights reserved</span>
          <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
            <span>🔒 Stripe Secured</span>
            <span>🇬🇧 London, UK</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function LondonLens() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [leads, setLeads] = useState([]);
  const cartIdRef = useRef(0);

  const showToast = useCallback((msg) => {
    setToast(msg);
  }, []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      if (prev.some(i => i.id === product.id)) return prev;
      cartIdRef.current++;
      return [...prev, { ...product, cartId: cartIdRef.current }];
    });
    showToast(`"${product.title}" added to cart`);
  }, [showToast]);

  const removeFromCart = useCallback((cartId) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  }, []);

  const handleCheckoutSuccess = useCallback(() => {
    setPurchases(prev => [...prev, ...cart]);
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    setPage("dashboard");
    showToast("Purchase complete! Downloads ready.");
  }, [cart, showToast]);

  const handleLeadSubmit = useCallback((email) => {
    setLeads(prev => [...prev, email]);
    showToast("Thanks! Your free checklist is on its way.");
  }, [showToast]);

  const navigateTo = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const pages = {
    home: <HomePage onAddToCart={addToCart} cart={cart} setPage={navigateTo} onLeadSubmit={handleLeadSubmit} />,
    products: <ProductsPage onAddToCart={addToCart} cart={cart} />,
    consultations: <ConsultationsPage onAddToCart={addToCart} cart={cart} />,
    tools: <ToolsPage />,
    blog: <BlogPage />,
    membership: <MembershipPage />,
    dashboard: <DashboardPage purchases={purchases} leads={leads} />,
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <Navbar page={page} setPage={navigateTo} cartCount={cart.length} openCart={() => setCartOpen(true)} />

        <main style={{flex:1}}>
          {pages[page] || pages.home}
        </main>

        <Footer setPage={navigateTo} />
      </div>

      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="scroll-top" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>↑</div>
    </>
  );
}
