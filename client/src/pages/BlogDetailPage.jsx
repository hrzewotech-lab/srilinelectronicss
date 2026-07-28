import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Mail, Share2, Calendar } from 'lucide-react';
import api from '../api/axios';

/* ════════════════════════════════════════════════════════════════
   ANIMATION UTILITIES  (same system as HomePage / ServicesPage / ProductsPage / ContactPage / InfrastructureMachineryPage / DesignEngineeringPage / FaqsPage)
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

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [typedTitle, titleDone] = useTypewriter(blog?.title || '', 28);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blog/${id}`);
        setBlog(res.data.blog);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load this article right now.');
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f7f9fb]">
        <div className="bg-white border border-[#E2E8F0] px-8 py-6 text-[#44474d] font-['Inter']">
          Loading article…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f7f9fb] px-6">
        <div className="bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] px-8 py-6 text-center font-['Inter']">
          {error}
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f7f9fb]">
        <div className="bg-white border border-[#E2E8F0] px-8 py-6 text-[#44474d] font-['Inter']">
          No article found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f9fb] font-['Inter'] min-h-screen">
      {/* Back link bar */}
      <div className="bg-[#0F172A] py-4">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Link
            to="/resources/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-[#c29f5d] transition-colors text-sm font-semibold"
            style={{ animation: 'bdHeroIn 0.6s ease both' }}
          >
            <ArrowLeft size={16} /> Back to blog
          </Link>
        </div>
      </div>

      {/* Full-width hero image */}
      <section className="bg-[#0F172A] pb-16 md:pb-24">
        <div
          className="relative w-full overflow-hidden bg-[#1a2436] group"
          style={{ animation: 'bdHeroIn 0.8s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          <img
            src={blog.image?.url || '/image.png'}
            alt={blog.title}
            className="w-full h-auto max-h-[600px] object-contain transition-transform duration-700 group-hover:scale-[1.03] mx-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Title card — overlaps the hero/content boundary */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-12 md:-mt-16 relative z-10">
        <div
          className="bg-white border border-[#E2E8F0] shadow-lg shadow-black/5 p-6 md:p-10 rounded-2xl"
          style={{ animation: 'bdCardIn 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          {/* Typewriter title */}
          <h1
            className="font-['JetBrains_Mono'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#0F172A] leading-tight mb-4"
            style={{ minHeight: '1.2em' }}
          >
            {typedTitle}
            {!titleDone && (
              <span
                style={{
                  display: 'inline-block',
                  width: 3,
                  height: '0.85em',
                  background: '#c29f5d',
                  marginLeft: 4,
                  verticalAlign: 'middle',
                  animation: 'bdCursorBlink 0.75s step-end infinite',
                }}
              />
            )}
          </h1>
          {blog.createdAt && (
            <div
              className="flex items-center gap-2 text-[#44474d] text-sm"
              style={{ opacity: titleDone ? 1 : 0, transition: 'opacity 0.5s ease' }}
            >
              <Calendar size={14} />
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Article body */}
        <article className="w-full">
          <Reveal>
            <div className="flex items-center gap-2 mb-6 text-[#9a7a3e]">
              <BookOpen size={20} />
              <span className="text-xs font-semibold uppercase tracking-wider">Article Overview</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="p-6 md:p-8 bg-white border-l-4 border-[#9a7a3e] border-y border-r border-[#E2E8F0] rounded-r-2xl rounded-l-md shadow-sm">
              <p className="font-['Inter'] text-base md:text-lg leading-relaxed text-[#334155] whitespace-pre-line">
                {blog.description}
              </p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="flex flex-wrap gap-3 pt-10 mt-10 border-t border-[#E2E8F0]">
              <Link
                to="/resources/blog"
                className="px-5 py-2.5 border border-[#75777e] text-[#0F172A] text-sm font-semibold hover:bg-[#eceef0] transition-colors rounded-lg"
              >
                Browse other articles
              </Link>
              <Link
                to="/contact-us"
                className="px-5 py-2.5 bg-[#0F172A] text-white text-sm font-semibold hover:opacity-90 transition-opacity rounded-lg"
              >
                Discuss this topic
              </Link>
            </div>
          </Reveal>
        </article>
      </main>

      <style>{`
        @keyframes bdHeroIn     { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bdCardIn     { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bdCursorBlink{ 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}