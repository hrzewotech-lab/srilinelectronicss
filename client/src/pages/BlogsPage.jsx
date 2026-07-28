import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Download, ZoomIn, X } from 'lucide-react';
import api from '../api/axios';

/* ════════════════════════════════════════════════════════════════
   ANIMATION UTILITIES
   ════════════════════════════════════════════════════════════════ */

function useTypewriter(text, speed = 40) {
  const [typed, setTyped] = useState('');
  const [done, setDone]   = useState(false);
  useEffect(() => {
    setTyped(''); setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++; setTyped(text.slice(0, i));
      if (i >= text.length) { setDone(true); clearInterval(id); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return [typed, done];
}

function Reveal({ children, delay = 0, y = 24, className = '', style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : `translateY(${y}px)`,
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function AnimatedNumber({ value }) {
  const ref     = useRef(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    started.current = false;
    const el  = ref.current;
    const num = Number(value);
    if (!el || isNaN(num)) { setDisplay(value); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true; obs.unobserve(el);
        let t0 = null;
        const tick = (ts) => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / 1600, 1);
          setDisplay(Math.floor((1 - (1 - p) ** 3) * num));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return <span ref={ref}>{display}</span>;
}

/* ════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function BlogsPage() {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/blog');
        setBlogs((res.data.blogs || []).filter((item) => item.isActive !== false));
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load blogs right now.');
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  const heroText              = 'Insights & Technical Updates';
  const [typedHero, heroDone] = useTypewriter(heroText, 42);

  return (
    <section className="bg-[#f7f9fb] min-h-screen font-['Inter']">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-[#0F172A] min-h-[340px] sm:min-h-[380px] md:min-h-[420px] flex items-center">
        <img src="/image.png" alt="Engineering manufacturing floor"
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0F172A]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/85 to-[#0F172A]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-0">
          <div className="max-w-2xl border-l-2 border-[#c29f5d] pl-5 md:pl-6"
            style={{ animation: 'blogsHeroIn 0.8s cubic-bezier(0.16,1,0.3,1) both' }}>

            <p className="text-[#c29f5d] text-xs font-semibold uppercase tracking-widest mb-3 md:mb-4"
              style={{ animation: 'blogsHeroIn 0.6s 0.05s ease both' }}>
              Engineering Journal
            </p>

            {/* Typewriter heading */}
            <h1 className="font-['JetBrains_Mono'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 md:mb-4"
              style={{ minHeight: '1.1em' }}>
              {typedHero}
              {!heroDone && (
                <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#c29f5d',
                  marginLeft: 4, verticalAlign: 'middle', animation: 'cursorBlink 0.75s step-end infinite' }} />
              )}
            </h1>

            {/* Sub-text fades after typing */}
            <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-5 md:mb-6 max-w-lg"
              style={{ opacity: heroDone ? 1 : 0, transform: heroDone ? 'none' : 'translateY(8px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
              Read the latest engineering, manufacturing, and quality articles from our team.
            </p>
          </div>

          {/* Blog count badge — fades + counts */}
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white shadow-sm backdrop-blur-sm"
            style={{ opacity: heroDone ? 1 : 0, transition: 'opacity 0.5s 0.2s ease' }}>
            <BookOpen size={18} />
            <span><AnimatedNumber value={blogs.length} /> blog posts</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#c29f5d]/60 via-[#c29f5d]/10 to-transparent" />
      </section>

      {/* ══ CONTENT ═══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">

        {/* ══ FEATURED FLYER/PAMPHLET ══════════════════════════════ */}
        <Reveal className="mb-16">
          <div className="bg-white border border-[#E2E8F0] hover:border-[#c29f5d]/50 transition-colors duration-300 shadow-sm rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#c29f5d]"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#9a7a3e]">Featured Announcement</span>
              </div>
              <h2 className="font-['JetBrains_Mono'] font-bold text-2xl sm:text-3xl text-[#0F172A] leading-tight">
                Celebrating 6X Growth in FY 2025-26
              </h2>
              <p className="text-sm sm:text-base text-[#44474d] leading-relaxed">
                SriLin Electronics is proud to announce an extraordinary milestone of 6X growth, expanded manufacturing capabilities, and a message of gratitude from our MD & CEO. 
              </p>
              <p className="text-sm text-[#44474d] leading-relaxed">
                We have doubled our assembly capacity, integrated advanced laser marking and ultrasonic welding machinery, set up a next-gen reliability testing burn-in room, and established a state-of-the-art testing laboratory. We are also introducing our Electronics Design & Development services, covering complete concept-to-production support.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => setIsLightboxOpen(true)}
                  className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1e293b] text-white text-sm font-semibold transition-all duration-200 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <ZoomIn size={16} />
                  View Full Pamphlet
                </button>
                <a 
                  href="/blog-pamphlet.jpg" 
                  download="SriLin-6X-Growth-Pamphlet.jpg"
                  className="px-5 py-2.5 border border-[#E2E8F0] hover:border-[#c29f5d] text-[#0F172A] hover:text-[#9a7a3e] text-sm font-semibold transition-all duration-200 rounded-lg flex items-center gap-2"
                >
                  <Download size={16} />
                  Download Image
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-5 flex justify-center items-center">
              <div 
                onClick={() => setIsLightboxOpen(true)}
                className="relative group cursor-zoom-in overflow-hidden rounded-2xl border border-[#E2E8F0] hover:border-[#c29f5d]/50 shadow-md max-w-sm w-full transition-all duration-300 hover:shadow-lg"
              >
                <img 
                  src="/blog-pamphlet.jpg" 
                  alt="SriLin Growth & Capabilities Pamphlet" 
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-103" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-[#0F172A]/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-[#0F172A]/90 backdrop-blur-sm text-white text-xs px-3.5 py-2 rounded-full font-semibold transition-all duration-300 shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0">
                    <ZoomIn size={14} /> Click to Zoom
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {loading ? (
          <Reveal>
            <div className="bg-white border border-[#E2E8F0] p-10 text-center text-[#44474d]">
              Loading blogs…
            </div>
          </Reveal>
        ) : error ? (
          <Reveal>
            <div className="bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] p-6 text-center">
              {error}
            </div>
          </Reveal>
        ) : !blogs.length ? (
          <Reveal>
            <div className="bg-white border border-[#E2E8F0] p-10 text-center text-[#44474d]">
              No blogs available yet.
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, i) => (
              <Reveal key={blog._id} delay={i * 70}>
                <article className="group bg-white border border-[#E2E8F0] hover:border-[#c29f5d] transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lg h-full rounded-2xl">
                  <div className="h-48 overflow-hidden bg-[#eceef0] relative">
                    <img src={blog.image?.url || '/image.png'} alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    {/* Teal top-border on hover */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c29f5d] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
                  </div>
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    {blog.readTime && (
                      <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#334155]">
                        <Clock size={14} /> {blog.readTime}
                      </span>
                    )}
                    <h3 className="font-['JetBrains_Mono'] font-semibold text-lg text-[#0F172A] leading-snug group-hover:text-[#9a7a3e] transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-[#44474d] line-clamp-3">
                      {blog.description}
                    </p>
                    <Link to={`/resources/blog/${blog._id}`}
                      className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[#9a7a3e] hover:underline pt-2">
                      Read full article
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* ══ LIGHTBOX MODAL ═════════════════════════════════════════ */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-zoom-out animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center animate-scaleIn">
            <button 
              className="fixed top-6 right-6 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-2.5 rounded-full transition-colors cursor-pointer"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <div 
              className="bg-white p-2 rounded-2xl shadow-2xl overflow-y-auto max-h-[80vh] flex justify-center cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src="/blog-pamphlet.jpg" 
                alt="SriLin Growth & Capabilities Pamphlet - Full View" 
                className="max-w-full h-auto max-h-[75vh] object-contain rounded-xl"
              />
            </div>
            <div className="mt-4 text-center text-white/70 text-sm">
              SriLin Growth & Capabilities Pamphlet. Click anywhere outside to close.
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blogsHeroIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes cursorBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0.95;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </section>
  );
}
