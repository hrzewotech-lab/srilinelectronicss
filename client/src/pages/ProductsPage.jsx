import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Boxes, Sparkles, ChevronRight, Mail } from 'lucide-react';
import api from '../api/axios';

/* ════════════════════════════════════════════════════════════════
   ANIMATION UTILITIES  (same system as HomePage / ServicesPage)
   ════════════════════════════════════════════════════════════════ */

function useTypewriter(text, speed = 40) {
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
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

function Reveal({ children, delay = 0, y = 26, className = '', style = {} }) {
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

function AnimatedNumber({ value, className = '', style = {} }) {
  const ref = useRef(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    started.current = false;
    const el = ref.current;
    if (!el) return;
    if (!/^\d/.test(String(value))) { setDisplay(value); return; }
    if (String(value).includes('/')) { setDisplay(value); return; }
    const raw = String(value).replace(/[^0-9.]/g, '');
    const num = parseFloat(raw);
    if (isNaN(num)) { setDisplay(value); return; }
    const suffix = String(value).replace(/^[\d,. ]+/, '');
    const hasComma = String(value).includes(',');
    const hasDecimal = String(value).replace(suffix, '').includes('.');
    const decimals = hasDecimal ? (String(value).replace(suffix, '').split('.')[1]?.length ?? 1) : 0;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true; obs.unobserve(el);
        let t0 = null;
        const dur = 1800;
        const tick = (ts) => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / dur, 1);
          const eased = 1 - (1 - p) ** 3;
          const cur = eased * num;
          const fmt = hasDecimal ? cur.toFixed(decimals) : hasComma ? Math.floor(cur).toLocaleString() : Math.floor(cur).toString();
          setDisplay(fmt + suffix);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return <span ref={ref} className={className} style={style}>{display}</span>;
}

/* ════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products');
        const list = (res.data.products || []).filter((item) => item.isActive !== false);
        setProducts(list);
        if (list.length) setActiveId(list[0]._id);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load products right now.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const heroText = 'Reliable Product Solutions';
  const [typedHero, heroDone] = useTypewriter(heroText, 45);

  return (
    <div className="bg-[#f7f9fb] font-['Inter'] min-h-screen">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative h-[42vh] sm:h-[46vh] md:h-[50vh] min-h-[340px] flex items-center overflow-hidden bg-[#0F172A]">
        <div className="absolute inset-0">
          <img
            src="/image.png"
            alt="Electronics products"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/70 to-[#0F172A]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-2xl" style={{ animation: 'prdHeroIn 0.8s cubic-bezier(0.16,1,0.3,1) both' }}>

            <span className="inline-block px-3 py-1 bg-[#c29f5d] text-[#0F172A] text-xs font-bold uppercase tracking-widest mb-3 md:mb-4"
              style={{ animation: 'prdHeroIn 0.6s 0.05s ease both' }}>
              Products
            </span>

            {/* Typewriter heading — "Reliable " plain, "Product Solutions" cyan */}
            <h1 className="font-['JetBrains_Mono'] font-bold text-2xl sm:text-3xl md:text-5xl text-white leading-tight mb-3 md:mb-5"
              style={{ minHeight: '1.15em' }}>
              {(() => {
                const plain = 'Reliable ';
                const accent = 'Product Solutions';
                if (typedHero.length <= plain.length) {
                  return (
                    <>
                      {typedHero}
                      {!heroDone && <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#f0c27b', marginLeft: 4, verticalAlign: 'middle', animation: 'cursorBlink 0.75s step-end infinite' }} />}
                    </>
                  );
                }
                return (
                  <>
                    {plain}
                    <span className="text-[#f0c27b]">{typedHero.slice(plain.length)}</span>
                    {!heroDone && <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#f0c27b', marginLeft: 4, verticalAlign: 'middle', animation: 'cursorBlink 0.75s step-end infinite' }} />}
                  </>
                );
              })()}
            </h1>

            <p className="text-white/80 text-sm sm:text-base md:text-lg mb-5 md:mb-8 max-w-lg"
              style={{ opacity: heroDone ? 1 : 0, transform: heroDone ? 'none' : 'translateY(8px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
              Explore active products and assemblies managed from the backend, with polished
              presentation for customers and partners.
            </p>

            {/* <div className="inline-flex items-center gap-2 bg-white text-[#0F172A] px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-['JetBrains_Mono'] font-bold"
              style={{ opacity: heroDone ? 1 : 0, transition: 'opacity 0.5s 0.2s ease' }}>
              <Boxes size={14} />
              {loading ? 'Loading…' : (
                <><AnimatedNumber value={String(products.length)} /> active products</>
              )}
            </div> */}
          </div>
        </div>
      </section>

      {/* ══ MAIN LAYOUT ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-16 lg:py-20">
        {loading ? (
          <Reveal>
            <div className="bg-white border border-[#E2E8F0] p-8 md:p-10 text-center text-[#44474d]">
              Loading products…
            </div>
          </Reveal>
        ) : error ? (
          <Reveal>
            <div className="bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] p-6 text-center">
              {error}
            </div>
          </Reveal>
        ) : !products.length ? (
          <Reveal>
            <div className="bg-white border border-[#E2E8F0] p-8 md:p-10 text-center text-[#44474d]">
              No products available yet.
            </div>
          </Reveal>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

            {/* ── Sidebar ── */}
            <Reveal className="lg:w-1/4 order-2 lg:order-1" delay={100}>
              <aside>
                <div className="lg:sticky lg:top-28 space-y-1">
                  <h3 className="font-['JetBrains_Mono'] text-xs text-[#334155] uppercase tracking-widest mb-3 md:mb-4">
                    Product Categories
                  </h3>
                  <div className="flex flex-wrap lg:flex-col gap-2 lg:gap-1">
                    {products.map((product, i) => {
                      if (!product || !product._id) return null;
                      return (
                        <Reveal key={product._id} delay={i * 40}>
                          <a
                            href={`#product-${product._id}`}
                            onClick={() => setActiveId(product._id)}
                            className={`group flex items-center justify-between gap-2 px-3 lg:p-4 py-2 border-l-4 font-['JetBrains_Mono'] text-xs md:text-sm transition-all ${activeId === product._id
                              ? 'bg-white border-[#9a7a3e] text-[#9a7a3e]'
                              : 'bg-white lg:bg-transparent border-[#E2E8F0] lg:border-transparent text-[#334155] hover:border-[#9a7a3e]/40 hover:bg-[#eceef0]'
                              }`}
                          >
                            <span className="truncate pr-1 max-w-[160px] lg:max-w-none">
                              {product.name || 'Untitled product'}
                            </span>
                            <ChevronRight size={14} className="shrink-0 group-hover:translate-x-1 transition-transform hidden lg:block" />
                          </a>
                        </Reveal>
                      );
                    })}
                  </div>

                  <Reveal delay={products.length * 40 + 80}>
                    <div className="mt-6 lg:mt-10 p-5 md:p-6 bg-[#0F172A] text-white rounded-2xl shadow-sm">
                      <h4 className="font-['JetBrains_Mono'] font-semibold text-base md:text-lg mb-2 md:mb-3">
                        Need a custom solution?
                      </h4>
                      <p className="text-xs md:text-sm text-white/70 mb-4 md:mb-5">
                        Our engineers can help spec the right product for your application.
                      </p>
                      <Link
                        to="/contact-us"
                        className="flex items-center justify-center gap-2 w-full py-2.5 md:py-3 border border-[#f0c27b] text-[#f0c27b] text-xs md:text-sm font-['JetBrains_Mono'] font-semibold hover:bg-[#f0c27b] hover:text-[#0F172A] transition-all rounded-lg"
                      >
                        <Mail size={14} /> Contact Us
                      </Link>
                    </div>
                  </Reveal>
                </div>
              </aside>
            </Reveal>

            {/* ── Product Cards ── */}
            <div className="lg:w-3/4 order-1 lg:order-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {products.map((product, index) => {
                  if (!product) return null;
                  const key = product._id || `product-${index}`;
                  const specs = Array.isArray(product.specifications) ? product.specifications : [];

                  return (
                    <Reveal key={key} delay={index * 60}>
                      <article
                        id={`product-${product._id || index}`}
                        className="group flex flex-col bg-white border border-[#E2E8F0] overflow-hidden hover:border-[#c29f5d] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full rounded-2xl"
                      >
                        {/* Image */}
                        <div className="h-36 sm:h-40 md:h-44 overflow-hidden relative bg-[#eceef0]">
                          <div className="absolute top-3 left-3 z-10 font-['JetBrains_Mono'] text-[10px] font-bold text-white/50">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div className="flex h-full w-full items-center justify-center p-3 sm:p-4">
                            <img
                              src={product.image?.url || '/image.png'}
                              alt={product.name || 'Product'}
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/image.png'; }}
                              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          {/* Teal top-border on hover */}
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#f0c27b] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
                        </div>

                        {/* Body */}
                        <div className="p-4 md:p-5 flex-grow flex flex-col">
                          <h3 className="font-['JetBrains_Mono'] font-semibold text-base md:text-lg text-[#0F172A] mb-2 leading-snug">
                            {product.name || 'Untitled product'}
                          </h3>
                          <p className="text-[#334155] text-xs md:text-sm mb-3 leading-relaxed line-clamp-2">
                            {product.description || 'No description provided.'}
                          </p>

                          {specs.length > 0 && (
                            <ul className="space-y-1.5 mb-3">
                              {specs.slice(0, 2).map((spec, specIndex) => (
                                <li key={`${key}-spec-${specIndex}`} className="flex items-start gap-1.5 text-xs text-[#44474d]">
                                  <Sparkles size={12} className="text-[#9a7a3e] mt-0.5 shrink-0" />
                                  <span className="line-clamp-1">{spec}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {product._id && (
                            <Link
                              to={`/products/${product._id}`}
                              className="mt-auto inline-flex items-center gap-1.5 text-[#9a7a3e] font-['JetBrains_Mono'] font-semibold text-xs md:text-sm hover:gap-2.5 transition-all"
                            >
                              View full details
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                          )}
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes prdHeroIn   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
