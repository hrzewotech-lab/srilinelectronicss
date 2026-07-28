import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('visible'); // visible → fadeOut

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fadeOut'), 2000);
    const t2 = setTimeout(() => onComplete?.(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#0F172A',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        opacity: phase === 'fadeOut' ? 0 : 1,
        transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: phase === 'fadeOut' ? 'none' : 'all',
      }}
    >
      {/* Tech grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(194, 159, 93,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(194, 159, 93,0.04) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 400, height: 400,
        background: 'radial-gradient(circle,rgba(194, 159, 93,0.08) 0%,transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Logo block */}
      <div style={{ position: 'relative', textAlign: 'center', animation: 'loaderFadeUp 0.7s ease both' }}>
        {/* Try real logo first, fall back to text */}
        <img
          src="/srilin-white.png"
          alt="SriLin Electronics"
          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'block'; }}
          style={{ height: 64, objectFit: 'contain', marginBottom: 20, display: 'block' }}
        />
        {/* Text fallback (hidden by default, shown if logo 404s) */}
        <div style={{ display: 'none', marginBottom: 20 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 800,
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            SriLin
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 400,
            fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
            color: '#c29f5d',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginTop: 6,
          }}>
            Electronics · EMS
          </div>
        </div>

        {/* Cert badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#c29f5d', border: '1px solid rgba(194, 159, 93,0.3)',
          background: 'rgba(194, 159, 93,0.06)',
          padding: '5px 12px',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#c29f5d',
            animation: 'loaderPulse 1.2s ease infinite',
          }} />
          AS9100D Certified EMS
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 2, background: 'rgba(255,255,255,0.06)',
      }}>
        <div style={{
          height: '100%', background: 'linear-gradient(90deg,#9a7a3e,#c29f5d)',
          animation: 'loaderProgress 1.9s cubic-bezier(0.4,0,0.2,1) forwards',
        }} />
      </div>

      {/* Scanning line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(194, 159, 93,0.35),transparent)',
        animation: 'loaderScan 1.8s ease-in-out infinite',
      }} />

      <style>{`
        @keyframes loaderFadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes loaderProgress  { from{width:0%} to{width:100%} }
        @keyframes loaderPulse     { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes loaderScan      { 0%{top:-2%} 50%{top:102%} 100%{top:-2%} }
      `}</style>
    </div>
  );
}
