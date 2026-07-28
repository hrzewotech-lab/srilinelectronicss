// Sandbox stub — premium HeroCarousel with typewriter, Ken Burns, stats panel
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

const fallbackSlides = [
  {
    _id: 'fallback-hero-1',
    title: 'Precision Electronics Manufacturing',
    description: 'Certified electronics design and manufacturing support for prototype, SMT assembly, testing, and box build programs.',
    image: { url: '/header1.webp' },
    tag: 'AS9100D Certified EMS',
  },
  {
    _id: 'fallback-hero-2',
    title: 'High-Reliability EMS for Demanding Products',
    description: 'Aerospace-aware quality systems, ESD controls, and disciplined inspection workflows from Hyderabad.',
    image: { url: '/header2-2.webp' },
    tag: 'ISO 9001:2015 Certified',
  },
  {
    _id: 'fallback-hero-3',
    title: 'From Embedded Design to Final Integration',
    description: 'A practical one-stop manufacturing partner for teams scaling complex electronic products with confidence.',
    image: { url: '/header3-2.webp' },
    tag: 'ANSI ESD S20.20 2021',
  },
];

const heroStats = [
  { value: '98%',     label: 'On-time delivery' },
  { value: '75+',     label: 'Global customers' },
  { value: '12 days', label: 'Prototype cycle'  },
];

/* ── Typewriter hook ───────────────────────────────────────── */
function useTypewriter(text, speed = 38) {
  const [typed, setTyped] = useState('');
  const [done, setDone]   = useState(false);
  useEffect(() => {
    setTyped('');
    setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) { setDone(true); clearInterval(id); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return [typed, done];
}

export default function HeroCarousel() {
  const [slides]                    = useState(fallbackSlides);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const activeSlide            = slides[activeIndex] || slides[0];
  const slideLabel             = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  const [typedTitle, typeDone] = useTypewriter(activeSlide?.title ?? '', 40);

  return (
    <section
      aria-label="Featured images"
      className="relative w-full overflow-hidden rounded-t-[20px] sm:rounded-t-[28px] border border-white/10"
      style={{ height: 'min(75vh, 580px)', minHeight: 450, background: '#0a1224' }}
    >
      {/* ── Slide images — Ken Burns zoom ── */}
      <div aria-live="polite">
        {slides.map((slide, index) => (
          <div
            key={slide._id || index}
            className="absolute inset-0"
            style={{
              opacity: index === activeIndex ? 1 : 0,
              zIndex: index === activeIndex ? 1 : 0,
              transition: 'opacity 1.1s ease',
            }}
          >
            <img
              src={slide.image?.url}
              alt={slide.title || `Featured image ${index + 1}`}
              className="w-full h-full object-cover object-center"
              style={{
                transform: index === activeIndex ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 6s ease',
                opacity: 0.78,
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Left side gradient overlay — keeps text readable ── */}
      <div className="absolute inset-y-0 left-0 w-full md:w-3/4 pointer-events-none" style={{ zIndex: 2,
        background: 'linear-gradient(90deg, rgba(10,18,36,0.96) 0%, rgba(10,18,36,0.8) 35%, rgba(10,18,36,0.2) 75%, transparent 100%)' }} />

      {/* ── Bottom gradient only — keeps bottom controls readable ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 2, height: 200,
        background: 'linear-gradient(to top, rgba(10,18,36,0.96) 0%, rgba(10,18,36,0.6) 50%, transparent 100%)' }} />

      {/* ── Tech grid ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3,
        backgroundImage: 'linear-gradient(rgba(212, 178, 111,0.028) 1px,transparent 1px),linear-gradient(90deg,rgba(212, 178, 111,0.028) 1px,transparent 1px)',
        backgroundSize: '64px 64px' }} />

      {/* ── Animated corner brackets ── */}
      <div className="absolute top-6 left-6 w-10 h-10 pointer-events-none" style={{ zIndex: 4,
        borderTop: '2px solid rgba(212, 178, 111,0.3)', borderLeft: '2px solid rgba(212, 178, 111,0.3)' }} />
      <div className="absolute top-6 right-6 w-10 h-10 pointer-events-none" style={{ zIndex: 4,
        borderTop: '2px solid rgba(212, 178, 111,0.3)', borderRight: '2px solid rgba(212, 178, 111,0.3)' }} />
      <div className="absolute bottom-14 left-6 w-10 h-10 pointer-events-none" style={{ zIndex: 4,
        borderBottom: '2px solid rgba(212, 178, 111,0.3)', borderLeft: '2px solid rgba(212, 178, 111,0.3)' }} />

      {/* ── Slide content ── */}
      <div className="relative flex flex-col justify-end h-full w-full px-6 sm:px-12 md:px-16 pb-12 sm:pb-16" style={{ zIndex: 10 }}>
        <div style={{ animation: 'heroSlideUp 0.75s cubic-bezier(0.16,1,0.3,1) both', maxWidth: 680 }}>

          {/* Cert badge */}
          <div style={{ animation: 'heroSlideUp 0.6s 0.1s ease both' }}>
            <span className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest"
              style={{ color: '#d4b26f', border: '1px solid rgba(212, 178, 111,0.35)', background: 'rgba(212, 178, 111,0.08)' }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: '#d4b26f', animation: 'hPulse 1.6s ease infinite' }} />
              <ShieldCheck size={11} />
              {activeSlide?.tag || 'AS9100D Certified EMS'}
            </span>
          </div>

          {/* Typewriter title */}
          <h1 className="text-white font-bold leading-[1.08] mb-5 font-['JetBrains_Mono']"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', textShadow: '0 2px 48px rgba(0,0,0,0.5)', minHeight: '1.08em' }}>
            {typedTitle}
            {/* Blinking cursor while typing */}
            {!typeDone && (
              <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#d4b26f',
                marginLeft: 4, verticalAlign: 'middle', animation: 'cursorBlink 0.75s step-end infinite' }} />
            )}
          </h1>

          {/* Description — fades in after title done */}
          <p className="leading-relaxed mb-8 transition-all duration-700"
            style={{
              fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
              color: 'rgba(203,213,225,0.85)',
              maxWidth: 520,
              opacity: typeDone ? 1 : 0,
              transform: typeDone ? 'none' : 'translateY(8px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}>
            {activeSlide?.description || ''}
          </p>

          {/* CTAs — fade in after desc */}
          <div className="flex flex-wrap gap-3"
            style={{
              opacity: typeDone ? 1 : 0,
              transform: typeDone ? 'none' : 'translateY(10px)',
              transition: 'opacity 0.6s 0.15s ease, transform 0.6s 0.15s ease',
            }}>
            <a href="/contact-us"
              className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3.5 transition-all duration-200 hover:opacity-90 hover:gap-3"
              style={{ background: '#d4b26f', color: '#0F172A' }}>
              Start a Project
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold px-7 py-3.5 text-white transition-colors hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.22)' }}>
              Explore Services
            </a>
          </div>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ zIndex: 10, background: 'rgba(255,255,255,0.07)' }}>
        <div key={`p-${activeIndex}`} className="h-full"
          style={{ background: 'linear-gradient(90deg,#9a7a3e,#d4b26f)',
            animation: 'progressFill 5.5s linear forwards' }} />
      </div>

      {/* ── Slide counter ── */}
      {slides.length > 0 && (
        <div className="absolute right-5 sm:right-10 bottom-8 font-['JetBrains_Mono'] text-xs tracking-widest"
          style={{ zIndex: 10, color: 'rgba(255,255,255,0.38)' }}>
          {slideLabel}
        </div>
      )}

      {/* ── Prev / Next ── */}
      {slides.length > 1 && (
        <>
          <button type="button" onClick={() => setActiveIndex((p) => (p - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 border border-white/20 text-white hover:border-[#d4b26f] hover:text-[#d4b26f] transition-all duration-200"
            style={{ zIndex: 10 }}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => setActiveIndex((p) => (p + 1) % slides.length)}
            aria-label="Next slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 border border-white/20 text-white hover:border-[#d4b26f] hover:text-[#d4b26f] transition-all duration-200"
            style={{ zIndex: 10 }}>
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {slides.length > 1 && (
        <div className="absolute left-4 sm:left-12 bottom-6 flex gap-2 items-center" style={{ zIndex: 10 }}>
          {slides.map((slide, index) => (
            <button key={slide._id || index} type="button" onClick={() => setActiveIndex(index)}
              aria-label={`Show slide ${index + 1}`} aria-current={index === activeIndex ? 'true' : undefined}
              style={{
                width: index === activeIndex ? 32 : 8, height: 4,
                background: index === activeIndex ? '#d4b26f' : 'rgba(255,255,255,0.22)',
                borderRadius: 2, border: 'none', padding: 0, cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
              }} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes heroSlideUp  { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroStatIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes progressFill { from{width:0%} to{width:100%} }
        @keyframes hPulse       { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes cursorBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </section>
  );
}
