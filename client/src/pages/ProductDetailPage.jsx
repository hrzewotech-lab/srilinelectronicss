import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Boxes, Sparkles, Share2, Mail } from 'lucide-react';
import api from '../api/axios';

const parseBoldText = (text) => {
  if (!text) return '';
  const parts = text.split('**');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="font-bold text-[#0F172A]">{part}</strong>;
    }
    return part;
  });
};

/* ════════════════════════════════════════════════════════════════
   ANIMATION UTILITIES
   ════════════════════════════════════════════════════════════════ */

function useTypewriter(text, speed = 38) {
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

/* ════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load this product right now.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  /* Typewriter starts automatically once product.name is available */
  const [typedTitle, titleDone] = useTypewriter(product?.name ?? '', 40);

  /* ── Loading / Error / Empty states ── */
  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#f7f9fb]">
      <div className="bg-white border border-[#E2E8F0] px-8 py-6 text-[#44474d] font-['Inter']"
        style={{ animation: 'detailFadeIn 0.5s ease both' }}>
        Loading product details…
      </div>
      <style>{`@keyframes detailFadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#f7f9fb] px-6">
      <div className="bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] px-8 py-6 text-center font-['Inter']">
        {error}
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#f7f9fb]">
      <div className="bg-white border border-[#E2E8F0] px-8 py-6 text-[#44474d] font-['Inter']">
        No product found.
      </div>
    </div>
  );

  return (
    <div className="bg-[#f7f9fb] font-['Inter'] min-h-screen">

      {/* ── Back bar ── */}
      <div className="bg-[#0F172A] py-4" style={{ animation: 'detailFadeIn 0.4s ease both' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <Link to="/products"
            className="inline-flex items-center gap-2 text-white/80 hover:text-[#c29f5d] transition-colors text-sm font-semibold">
            <ArrowLeft size={16} /> Back to products
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative bg-[#0F172A]"
        style={{ backgroundImage: `url('/header2-2.webp')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-[#0F172A]/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-14 md:py-20">

          {/* Label */}
          <div className="flex items-center gap-3 mb-5" style={{ animation: 'detailFadeIn 0.5s 0.1s ease both' }}>
            <span className="w-8 h-[2px] bg-[#f0c27b]" />
            <span className="font-['JetBrains_Mono'] text-[#f0c27b] text-xs font-bold uppercase tracking-[0.15em]">
              Srilin Electronics — Product
            </span>
          </div>

          {/* Typewriter h1 */}
          <h1 className="font-['JetBrains_Mono'] font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight max-w-3xl mb-6"
            style={{ minHeight: '1.1em' }}>
            {typedTitle}
            {!titleDone && (
              <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#f0c27b',
                marginLeft: 4, verticalAlign: 'middle', animation: 'cursorBlink 0.75s step-end infinite' }} />
            )}
          </h1>

          {/* Badges — fade in after typing */}
          <div className="flex flex-wrap gap-2"
            style={{ opacity: titleDone ? 1 : 0, transform: titleDone ? 'none' : 'translateY(8px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
            <span className="px-3 py-1 bg-[#c29f5d]/20 text-[#f0c27b] text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-widest border border-[#f0c27b]/30">
              Srilin Product
            </span>
            <span className="px-3 py-1 bg-white/10 text-white/70 text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-widest border border-white/20">
              Electronics
            </span>
          </div>
        </div>
      </section>

      {/* ── Body layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ══ LEFT COLUMN ══ */}
          <div className="flex flex-col gap-5">

            {/* Image */}
            <Reveal delay={0}>
              <div className="relative w-full overflow-hidden border border-[#E2E8F0] shadow-sm group rounded-2xl bg-white">
                <img src={product.image?.url || '/image.png'} alt={product.name}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/image.png'; }}
                  className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-0 left-0 w-1 h-full bg-[#9a7a3e]" />
              </div>
            </Reveal>
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="flex flex-col gap-5">

            {/* Overview card */}
            <Reveal delay={60}>
              <div className="bg-white border border-[#E2E8F0] shadow-sm hover:border-[#9a7a3e]/30 transition-colors rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-[#E2E8F0]">
                  <Boxes size={16} className="text-[#9a7a3e]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9a7a3e]">
                    Product Overview
                  </span>
                </div>
                 <div className="px-6 py-5">
                   <p className="text-base md:text-[17px] leading-relaxed text-[#334155] whitespace-pre-line">
                     {parseBoldText(product.description)}
                   </p>
                 </div>
              </div>
            </Reveal>

            {/* Specifications card */}
            {Array.isArray(product.specifications) && product.specifications.length > 0 && (
              <Reveal delay={140}>
                <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-6 py-4 border-b border-[#E2E8F0]">
                    <Sparkles size={16} className="text-[#9a7a3e]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#9a7a3e]">
                      Key Highlights
                    </span>
                  </div>
                  <ul className="px-6 py-5 space-y-3">
                    {product.specifications.map((spec, i) => (
                      <Reveal key={spec} delay={i * 60}>
                        <li className="flex items-start gap-3 p-3 border border-[#E2E8F0] hover:border-[#9a7a3e] hover:bg-[#f7f9fb] transition-colors rounded-xl">
                          <span className="mt-0.5 w-5 h-5 rounded-full bg-[#c29f5d]/20 flex items-center justify-center shrink-0">
                            <Sparkles size={11} className="text-[#9a7a3e]" />
                          </span>
                           <span className="text-[#334155] text-sm leading-relaxed">{parseBoldText(spec)}</span>
                        </li>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes detailFadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes cursorBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
