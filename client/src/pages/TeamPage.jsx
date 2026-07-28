import { useEffect, useMemo, useRef, useState } from 'react';
import { Award, BriefcaseBusiness, CheckCircle2, Factory, ShieldCheck, Star, Users, X } from 'lucide-react';
import api from '../api/axios';

/* ════════════════════════════════════════════════════════════════
   ANIMATION UTILITIES  (same system as HomePage / AboutPage / ServicesPage)
   ════════════════════════════════════════════════════════════════ */

/** Types out text one character at a time. Returns [displayedText, isDone]. */
function useTypewriter(text, speed = 40) {
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
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

/** Scroll-reveal wrapper — fades + slides up on entering viewport. */
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
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Counts a numeric string up from zero when scrolled into view. */
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
        started.current = true;
        obs.unobserve(el);
        let t0 = null;
        const dur = 1800;
        const tick = (ts) => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / dur, 1);
          const eased = 1 - (1 - p) ** 3;
          const cur = eased * num;
          const fmt = hasDecimal ? cur.toFixed(decimals)
            : hasComma ? Math.floor(cur).toLocaleString()
              : Math.floor(cur).toString();
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

/** Full-detail popup shown when a member card is clicked. */
function MemberModal({ member, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!member) return null;

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      style={{ animation: 'modalOverlayIn 0.25s ease both' }}
    >
      <div className="absolute inset-0 bg-[#0F172A]/75 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={member.name}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col md:flex-row animate-scaleIn"
        style={{ animation: 'modalPanelIn 0.3s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#0F172A] shadow-lg hover:bg-[#0F172A] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-200/50"
        >
          <X size={18} />
        </button>

        {/* Left: Image Container */}
        <div className="w-full md:w-2/5 h-48 sm:h-56 md:h-auto bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#E2E8F0] shrink-0">
          <img
            src={member.image?.url}
            alt={member.name}
            className="w-full h-full object-contain rounded-2xl drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        {/* Right: Content details */}
        <div className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto premium-scrollbar">
          {member.designation ? (
            <p className="text-xs uppercase tracking-[0.26em] text-[#9a7a3e] font-semibold mb-2">
              {member.designation}
            </p>
          ) : null}

          <h2 className="font-['JetBrains_Mono'] text-xl md:text-2xl font-bold text-[#0F172A] mb-4">
            {member.name}
          </h2>

          {member.message ? (
            <p className="text-sm text-[#475569] leading-relaxed mb-6 whitespace-pre-line">
              {member.message}
            </p>
          ) : null}

          {member.honors?.length ? (
            <div className="pt-4 border-t border-[#E2E8F0] mt-auto">
              <p className="text-xs uppercase tracking-[0.26em] text-[#94A3B8] mb-3 font-semibold">Honors</p>
              <ul className="grid gap-2 text-xs md:text-sm text-[#475569]">
                {member.honors.map((honor) => (
                  <li key={honor} className="flex items-start gap-2">
                    <Award size={15} className="text-[#c29f5d] mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{honor}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const leadershipPillars = [
  {
    icon: Factory,
    title: 'Manufacturing Focus',
    text: 'Production-aware decisions shaped around repeatable electronics builds.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Discipline',
    text: 'Inspection, validation, and documentation kept visible across delivery.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Customer Ownership',
    text: 'Clear communication from requirement review through execution.',
  },
];

/* ════════════════════════════════════════════════════════════════
   FEATURED LEADERSHIP CARD  (CEO / COO / CFO style)
   ════════════════════════════════════════════════════════════════ */
function FeaturedCard({ member, index, onClick }) {
  const hasMessage = !!member.message;

  return (
    <Reveal delay={index * 100} className="h-full">
      <article
        role="button"
        tabIndex={0}
        onClick={() => onClick(member)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(member); } }}
        className="h-full flex flex-col cursor-pointer rounded-[28px] border border-[#E2E8F0] bg-white shadow-sm hover:border-[#c29f5d] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        {/* Gold accent top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#c29f5d] via-[#f0c27b] to-[#c29f5d]" />

        <div className="flex flex-col flex-1 p-6">
          {/* Circular avatar */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-[#E2E8F0] bg-[#eceef0] shadow-md">
                <img
                  src={member.image?.url}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#c29f5d] shadow-md">
                <Star size={13} className="text-white fill-white" aria-hidden="true" />
              </span>
            </div>
          </div>

          {/* Name + designation */}
          <div className="text-center mb-4">
            <h3 className="font-['JetBrains_Mono'] text-xl font-bold text-[#0F172A] mb-1">
              {member.name}
            </h3>
            <span className="inline-block px-3 py-1 rounded-full bg-[#ecfeff] text-[#0F766E] text-xs font-semibold tracking-wide">
              {member.designation}
            </span>
          </div>

          {/* Message excerpt */}
          {member.message ? (
            <p className="text-sm text-[#475569] leading-relaxed text-center line-clamp-3 mb-4 flex-1">
              {member.message}
            </p>
          ) : null}

          {/* Honors */}
          {member.honors?.length ? (
            <div className={`border-t border-[#E2E8F0] pt-4 ${hasMessage ? "mt-auto" : "mt-4"}`}>
              <ul className="grid gap-1.5">
                {member.honors.slice(0, 3).map((honor) => (
                  <li key={honor} className="flex items-center gap-2 text-xs text-[#475569]">
                    <Award size={13} className="text-[#c29f5d] shrink-0" aria-hidden="true" />
                    <span className="line-clamp-1">{honor}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

        </div>
      </article>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════
   BROADER LEADERSHIP ROW CARD  (Dept Heads / Regional Managers)
   ════════════════════════════════════════════════════════════════ */
function BroaderCard({ member, index, onClick }) {
  return (
    <Reveal delay={index * 50}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(member)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(member); } }}
        className="cursor-pointer flex items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 shadow-sm hover:border-[#c29f5d] hover:-translate-y-0.5 hover:shadow-md transition-all duration-250 group"
      >
        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-[#eceef0] border border-[#E2E8F0]">
          <img
            src={member.image?.url}
            alt={member.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[#0F172A] truncate">{member.name}</h3>
          <p className="text-xs text-[#0F766E] font-medium mt-0.5 truncate">{member.designation}</p>
          {member.message ? (
            <p className="mt-1 text-xs text-[#64748b] leading-relaxed line-clamp-1">{member.message}</p>
          ) : null}
        </div>
        <svg
          className="w-4 h-4 text-[#94A3B8] group-hover:text-[#c29f5d] group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadTeam = async () => {
      try {
        const response = await api.get('/team');
        if (isMounted) {
          setMembers(
            (response.data.members || []).filter(
              (member) => member.isActive !== false && member.image?.url
            )
          );
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError?.response?.data?.message || 'Unable to load the team right now.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTeam();
    return () => {
      isMounted = false;
    };
  }, []);

  /* ── Data split:
       featuredMembers  → isFeatured = true  (CEO, COO, CFO …)
       broaderMembers   → isFeatured = false (Dept Heads, Regional Mgrs …)
  ─────────────────────────────────────────────────────────── */
  const { featuredMembers, broaderMembers } = useMemo(() => {
    const sorted = [...members].sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
    return {
      featuredMembers: sorted.filter((m) => m.isFeatured),
      broaderMembers: sorted.filter((m) => !m.isFeatured),
    };
  }, [members]);

  const stats = useMemo(() => ({
    total: members.length,
    featured: members.filter((m) => m.isFeatured).length,
    broader: members.filter((m) => !m.isFeatured).length,
  }), [members]);

  /* Typewriter for the hero h1 — plain text only (no JSX span inside) */
  const heroText = 'Leadership That Builds Trust';
  const [typedHero, heroDone] = useTypewriter(heroText, 45);

  return (
    <section className="bg-[#f7f9fb] font-['Inter']">
      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-[#0F172A] min-h-[340px] sm:min-h-[380px] md:min-h-[420px] flex items-center">
        <img
          src="/about-us2.png"
          alt="SriLin team and manufacturing leadership"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0F172A]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/85 to-[#0F172A]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-0">
          <div
            className="max-w-2xl border-l-2 border-[#c29f5d] pl-5 md:pl-6"
            style={{ animation: 'teamHeroIn 0.8s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            <p
              className="text-[#c29f5d] text-xs font-semibold uppercase tracking-widest mb-3 md:mb-4"
              style={{ animation: 'teamHeroIn 0.6s 0.05s ease both' }}
            >
              Our People
            </p>

            {/* Typewriter heading */}
            <h1
              className="font-['JetBrains_Mono'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 md:mb-4"
              style={{ minHeight: '1.15em' }}
            >
              {typedHero}
              {!heroDone && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 3,
                    height: '0.85em',
                    background: '#f0c27b',
                    marginLeft: 4,
                    verticalAlign: 'middle',
                    animation: 'cursorBlink 0.75s step-end infinite',
                  }}
                />
              )}
            </h1>

            <p
              className="text-white/75 text-sm sm:text-base leading-relaxed mb-5 md:mb-6 max-w-lg"
              style={{
                opacity: heroDone ? 1 : 0,
                transform: heroDone ? 'none' : 'translateY(8px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              Meet the people guiding Srilin Electronics through dependable production,
              disciplined quality workflows, and customer-focused delivery.
            </p>

            <div
              className="flex flex-wrap gap-2.5 sm:gap-3"
              style={{ opacity: heroDone ? 1 : 0, transition: 'opacity 0.5s 0.2s ease' }}
            >
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-[#c29f5d]/30 text-[#ffe8cc] text-xs font-semibold px-3 py-1.5 backdrop-blur-sm">
                <Star size={13} />
                {loading ? 'Loading…' : (
                  <><AnimatedNumber value={String(stats.featured)} /> featured leaders</>
                )}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-[#c29f5d]/30 text-[#ffe8cc] text-xs font-semibold px-3 py-1.5 backdrop-blur-sm">
                <Users size={13} />
                {loading ? 'Loading…' : (
                  <><AnimatedNumber value={String(stats.total)} /> team profiles</>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#c29f5d]/60 via-[#c29f5d]/10 to-transparent" />
      </section>

      {/* ══ MAIN LAYOUT ═══════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_0.8fr] gap-8 items-start mb-12">
          <Reveal>
            <div>
              <h2 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-[#0F172A] border-l-4 border-[#c29f5d] pl-4">
                About our leadership
              </h2>
              <p className="text-[#44474d] mt-4 leading-relaxed">
                Srilin is led by engineers and operators who understand both product design and scalable manufacturing. Our team bridges the gap between concept, quality, and delivery.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {leadershipPillars.map(({ icon: Icon, title, text }, i) => (
                  <Reveal key={title} delay={i * 80}>
                    <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm hover:border-[#c29f5d] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#c29f5d]/10 text-[#c29f5d]">
                        <Icon size={20} aria-hidden="true" />
                      </div>
                      <h3 className="font-semibold text-base text-[#0F172A] mb-2">{title}</h3>
                      <p className="text-sm text-[#64748b] leading-relaxed">{text}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          {/* <Reveal delay={150}>
            <aside className="rounded-3xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8] mb-3 text-center lg:text-left">
                Team snapshot
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-[#f7f9fb] p-2.5 text-center">
                  <p className="text-xl md:text-2xl font-['JetBrains_Mono'] text-[#0F172A] font-bold">
                    <AnimatedNumber value={String(stats.total)} />
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-[#94A3B8] mt-1.5">Total</p>
                </div>
                <div className="rounded-2xl bg-[#f7f9fb] p-2.5 text-center">
                  <p className="text-xl md:text-2xl font-['JetBrains_Mono'] text-[#c29f5d] font-bold">
                    <AnimatedNumber value={String(stats.featured)} />
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-[#94A3B8] mt-1.5">Featured</p>
                </div>
                <div className="rounded-2xl bg-[#f7f9fb] p-2.5 text-center">
                  <p className="text-xl md:text-2xl font-['JetBrains_Mono'] text-[#c29f5d] font-bold">
                    <AnimatedNumber value={String(stats.broader)} />
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-[#94A3B8] mt-1.5">Leaders</p>
                </div>
              </div>
            </aside>
          </Reveal> */}
        </div>

        {loading ? (
          <Reveal>
            <div className="bg-white border border-[#E2E8F0] p-10 text-center text-[#44474d] rounded-3xl">
              Loading team profiles...
            </div>
          </Reveal>
        ) : error ? (
          <Reveal>
            <div className="bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] p-10 text-center rounded-3xl">
              {error}
            </div>
          </Reveal>
        ) : !members.length ? (
          <Reveal>
            <div className="bg-white border border-[#E2E8F0] p-10 text-center text-[#44474d] rounded-3xl">
              No team profiles are available yet.
            </div>
          </Reveal>
        ) : (
          <>
            {/* ══════════════════════════════════════════════════════
                SECTION 1 — FEATURED LEADERSHIP  (CEO / COO / CFO)
                ══════════════════════════════════════════════════════ */}
            {featuredMembers.length > 0 && (
              <section className="mb-16" aria-labelledby="featured-leadership-heading">
                <Reveal>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-[#c29f5d] font-semibold mb-1.5">
                        Executive team
                      </p>
                      <h2
                        id="featured-leadership-heading"
                        className="font-['JetBrains_Mono'] text-2xl md:text-3xl font-bold text-[#0F172A] flex items-center gap-2"
                      >
                        <Star size={22} className="text-[#c29f5d]" aria-hidden="true" />
                        Featured Leadership
                      </h2>
                      <p className="text-sm text-[#64748b] mt-1.5 max-w-lg">
                        Our executive leaders — CEO, COO, CFO and senior directors — setting strategy, vision, and direction for Srilin Electronics.
                      </p>
                    </div>
                    <span className="inline-flex items-center self-start sm:self-auto gap-2 rounded-full bg-[#c29f5d]/10 border border-[#c29f5d]/30 px-4 py-2 text-sm font-semibold text-[#c29f5d] whitespace-nowrap">
                      <Star size={14} className="fill-[#c29f5d]" aria-hidden="true" />
                      {featuredMembers.length} leader{featuredMembers.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {/* Gold divider */}
                  <div className="h-px w-full bg-gradient-to-r from-[#c29f5d]/40 via-[#c29f5d]/10 to-transparent mb-8" />
                </Reveal>

                <div
                  className={`grid gap-6 ${featuredMembers.length === 1
                    ? 'grid-cols-1 max-w-sm mx-auto'
                    : featuredMembers.length === 2
                      ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    }`}
                >
                  {featuredMembers.map((member, i) => (
                    <FeaturedCard
                      key={member._id}
                      member={member}
                      index={i}
                      onClick={setSelectedMember}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ══════════════════════════════════════════════════════
                SECTION 2 — BROADER LEADERSHIP TEAM
                (Dept Heads, Regional Managers, Functional Leaders)
                ══════════════════════════════════════════════════════ */}
            {broaderMembers.length > 0 && (
              <section aria-labelledby="broader-leadership-heading">
                <Reveal>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-[#0F766E] font-semibold mb-1.5">
                        Leadership roster
                      </p>
                      <h2
                        id="broader-leadership-heading"
                        className="font-['JetBrains_Mono'] text-2xl md:text-3xl font-bold text-[#0F172A] flex items-center gap-2"
                      >
                        <Users size={22} className="text-[#0F766E]" aria-hidden="true" />
                        Broader Leadership Team
                      </h2>
                      <p className="text-sm text-[#64748b] mt-1.5 max-w-lg">
                        Department heads, regional managers, and functional leaders who drive execution, alignment, and day-to-day operations.
                      </p>
                    </div>
                    <span className="inline-flex items-center self-start sm:self-auto gap-2 rounded-full bg-[#ecfeff] border border-[#0F766E]/20 px-4 py-2 text-sm font-semibold text-[#0F766E] whitespace-nowrap">
                      <Users size={14} aria-hidden="true" />
                      {broaderMembers.length} member{broaderMembers.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {/* Teal divider */}
                  <div className="h-px w-full bg-gradient-to-r from-[#0F766E]/30 via-[#0F766E]/10 to-transparent mb-8" />
                </Reveal>

                <div className="grid gap-3 sm:grid-cols-2">
                  {broaderMembers.map((member, i) => (
                    <BroaderCard
                      key={member._id}
                      member={member}
                      index={i}
                      onClick={setSelectedMember}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </section>

      <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />

      <style>{`
        @keyframes teamHeroIn    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cursorBlink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes modalOverlayIn { from{opacity:0} to{opacity:1} }
        @keyframes modalPanelIn  { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        /* Premium scrollbar styles */
        .premium-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .premium-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .premium-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
          transition: background-color 0.2s ease;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </section>
  );
}