import { useEffect, useRef, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  CheckCircle2 as CheckCircleIcon,
  Cpu,
  Factory,
  MapPin,
  ShieldCheck,
  Smile,
  TrendingUp,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   STATIC DATA — all original arrays unchanged
   ════════════════════════════════════════════════════════════════ */
const aboutStats = [
  { value: '2017', label: 'Established', icon: BadgeCheck },
  { value: '25,000', label: 'Sqft current facility', icon: Building2 },
  { value: '214,000', label: 'Sqft expansion space', icon: TrendingUp },
  { value: '9+', label: 'Years ', icon: ShieldCheck },
];

const featuredStat = {
  value: 'ISO-8',
  label: 'Cleanroom class',
  description:
    'Class 100000 manufacturing in a certified ESD-safe cleanroom with aerospace and defence traceability.',
  icon: ShieldCheck,
};

const certificationBadges = [
  'ISO9001:2015',
  'AS9100D',
  'ANSI ESD S20.20 2021',
  'IEC 61340 5.1',
];

const aboutServices = [
  'Embedded Design',
  'SMT Mounting',
  'Product Integration',
  'Testing',
  'Box Build',
  'Supply Chain Management',
];

const aboutHighlights = [
  {
    icon: MapPin,
    title: 'Strategic Location',
    meta: '15 minutes from airport cargo terminal',
    text: "Located at Fabcity (E-City EMC), Hyderabad. 15 minutes from Rajiv Gandhi International Airport and cargo terminal. The facility sits in Hyderabad's southern manufacturing corridor, one of India's primary hubs for aerospace and defence electronics production.",
  },
  {
    icon: ShieldCheck,
    title: 'High Reliability Specialist',
    meta: 'Aerospace, defence, automotive and more',
    text: 'AS9100D certified with active production across Aerospace, Defence, Automotive, IT Hardware, Telecom, Medtech and Consumer Electronics. Srilin operates in sectors where product failure carries critical consequences. Every board is traceable from component to shipment.',
  },
  {
    icon: TrendingUp,
    title: 'Built to Scale',
    meta: '8x expansion footprint on same campus',
    text: '214,000 sqft of expansion space adjacent to the current 25,000 sqft facility. 8x the current footprint on the same campus. No greenfield construction required. Dedicated production clusters can be established for strategic partners.',
  },
  {
    icon: Smile,
    title: 'Customer Satisfaction',
    meta: 'Flexible volumes and account ownership',
    text: 'Dedicated account management, quick prototyping, and flexible production volumes tailored to your exact requirements.',
  },
  {
    icon: BadgeCheck,
    title: 'Quality First Approach',
    meta: '3D SPI, 3D AOI and X-ray systems',
    text: 'Multi-stage inspection with 3D SPI, 3D AOI, and X-ray systems. Mounter accuracy 0.025mm, CpK >= 1.00 (3 sigma).',
  },
];

/* ════════════════════════════════════════════════════════════════
   ANIMATION UTILITIES  (same system as HomePage)
   ════════════════════════════════════════════════════════════════ */

/** Types out text character by character. Returns [displayedText, isDone]. */
function useTypewriter(text, speed = 42) {
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
      { threshold: 0.1 },
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

/** Counts a numeric string (e.g. '25,000', '18+') up from zero when scrolled into view. */
function AnimatedNumber({ value, className = '', style = {} }) {
  const ref = useRef(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip values that don't start with a digit (e.g. 'ISO-8')
    if (!/^\d/.test(String(value))) { setDisplay(value); return; }
    // Skip values containing '/' (e.g. '4.9/5')
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
        const dur = 2000;
        const tick = (ts) => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / dur, 1);
          const eased = 1 - (1 - p) ** 3;
          const cur = eased * num;
          const fmt = hasDecimal
            ? cur.toFixed(decimals)
            : hasComma
              ? Math.floor(cur).toLocaleString()
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

/* ════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function AboutCompanyPage() {
  const heroTitle = 'Srilin Electronics\nPrivate Limited';
  const [typedHero, heroDone] = useTypewriter(heroTitle, 36);

  return (
    <div className="bg-[#f7f9fb] font-['Inter'] min-h-screen">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-[#0F172A] min-h-[340px] sm:min-h-[380px] md:min-h-[420px] flex items-center">
        <img
          src="/about-us2.png"
          alt="SriLin electronics manufacturing services graphic"
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
          <div className="max-w-2xl border-l-2 border-[#c29f5d] pl-5 md:pl-6" style={{ animation: 'aboutHeroIn 0.8s cubic-bezier(0.16,1,0.3,1) both' }}>

            {/* Section label */}
            <p className="text-[#c29f5d] text-xs font-semibold uppercase tracking-widest mb-3 md:mb-4"
              style={{ animation: 'aboutHeroIn 0.6s 0.1s ease both' }}>
              About Company
            </p>

            {/* Typewriter heading */}
            <h1 className="font-['JetBrains_Mono'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 md:mb-4"
              style={{ minHeight: '1.2em', whiteSpace: 'pre-line' }}>
              {typedHero}
              {/* Blinking cursor while typing */}
              {!heroDone && (
                <span style={{
                  display: 'inline-block', width: 3, height: '0.85em',
                  background: '#c29f5d', marginLeft: 4, verticalAlign: 'middle',
                  animation: 'cursorBlink 0.75s step-end infinite',
                }} />
              )}
            </h1>

            {/* Sub-text fades in after typing done */}
            <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-5 md:mb-6 max-w-lg transition-all duration-700"
              style={{ opacity: heroDone ? 1 : 0, transform: heroDone ? 'none' : 'translateY(8px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
              Premier ESDM/EMS services with certified quality systems, scalable production,
              and reliable manufacturing support from design to box build.
            </p>

            {/* Badges fade in after desc */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 transition-all duration-700"
              style={{ opacity: heroDone ? 1 : 0, transform: heroDone ? 'none' : 'translateY(8px)', transition: 'opacity 0.6s 0.15s ease, transform 0.6s 0.15s ease' }}
              aria-label="Srilin certifications">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-[#c29f5d]/30 text-[#ffd199] text-xs font-semibold px-3 py-1.5 backdrop-blur-sm">
                <CheckCircleIcon size={13} /> ISO &amp; AS9 Certified
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-[#c29f5d]/30 text-[#ffd199] text-xs font-semibold px-3 py-1.5 backdrop-blur-sm">
                <Building2 size={13} /> E-City EMC, Hyderabad
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#c29f5d]/60 via-[#c29f5d]/10 to-transparent" />
      </section>

      {/* ══ INTRO + CERTS ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">

          {/* Body text */}
          <Reveal className="lg:col-span-2" delay={0}>
            <h2 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-[#0F172A] border-l-4 border-[#c29f5d] pl-4">
              About Srilin
            </h2>
            <p className="text-[#44474d] mt-4 leading-relaxed">
              Srilin Electronics Pvt Ltd is an ISO9001:2015, AS9100D, ANSI ESD S20.20 2021 & IEC 61340 5.1 certified Premier Electronics System Design & Manufacturing Services (ESDM/EMS) company located in E-city EMC (Formerly Fabcity), Hyderabad, India. The company was established in 2017 to help the developing interest of Electronic Assembling in India. Our one-stop-solution electronics manufacturing services (EMS) factory incorporates quick prototyping, mid-range volume production to high volume production.
            </p>
            <p className="text-[#44474d] mt-4 leading-relaxed">
              We provide Embedded Design, SMT Mounting, product integration, Testing & box build services. Our products are manufactured using Robust and advanced SMT machinery in Class 100000(ISO-8) Cleanroom to meet world wide quality standards. We also provide comprehensive supply chain management.we offer our administrations to a wide range of customers for their product development and support them in convertibility and scalability of manufacturing. SRILIN has been the favoured worth maker for its clients through imaginative and effective Electronic System Assembling. </p>

            <div className="mt-6 flex flex-wrap gap-3" aria-label="Srilin certifications">
              {certificationBadges.map((cert, i) => (
                <Reveal key={cert} delay={i * 60} style={{ display: 'inline-block' }}>
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] text-sm text-[#0F172A] shadow-sm rounded-lg">
                    <ShieldCheck size={16} className="text-[#c29f5d]" />
                    <span className="font-semibold">{cert}</span>
                  </span>
                </Reveal>
              ))}
            </div>
          </Reveal>

          {/* Aside card */}
          <Reveal delay={150}>
            <aside className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
              <img src="/about-us2.png" alt="Srilin electronics manufacturing facility" className="h-48 w-full object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#c29f5d]/10 text-[#c29f5d] rounded-xl shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] uppercase tracking-widest">Location</p>
                    <p className="font-semibold text-sm text-[#0F172A]">E-City EMC, Hyderabad</p>
                  </div>
                </div>
                <p className="text-sm text-[#44474d] leading-relaxed">
                  15 minutes from Rajiv Gandhi International Airport and cargo terminal. Positioned in
                  Hyderabad's manufacturing corridor for aerospace and defence electronics.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>

        {/* ══ STATS + SERVICES ══════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr] mb-16">

          <div className="grid gap-4">
            {/* Stat cards — counting numbers */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {aboutStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Reveal key={stat.label} delay={i * 80}>
                    <article className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c29f5d] hover:shadow-lg">
                      {/* Top accent bar on hover */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c29f5d] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-t-2xl" />
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <strong className="block text-2xl font-['JetBrains_Mono'] text-[#0F172A] leading-tight">
                            <AnimatedNumber value={stat.value} />
                          </strong>
                          <span className="mt-2 block text-sm text-[#64748b] leading-snug">
                            {stat.label}
                          </span>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c29f5d]/10 text-[#c29f5d] shadow-sm shrink-0">
                          <Icon size={18} strokeWidth={1.8} />
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            {/* Facility image */}
            <Reveal delay={200}>
              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
                <img src="/about-us2.png" alt="Srilin electronics manufacturing facility" className="h-full w-full object-cover" />
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-4">
            {/* Featured ISO-8 stat */}
            <Reveal delay={100}>
              <article className="rounded-3xl border border-[#E2E8F0] bg-[#f8fafc] p-6 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#94A3B8]">Featured Stat</p>
                    <div className="mt-4 flex items-center gap-3 text-[#0F172A]">
                      <strong className="text-5xl font-['JetBrains_Mono'] leading-none">
                        <AnimatedNumber value={featuredStat.value} />
                      </strong>
                      <div className="rounded-xl bg-[#c29f5d]/10 p-3 text-[#c29f5d] shadow-sm">
                        {(() => { const FeaturedIcon = featuredStat.icon; return <FeaturedIcon size={24} strokeWidth={1.8} />; })()}
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-[#475569]">{featuredStat.label}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[#475569]">{featuredStat.description}</p>
              </article>
            </Reveal>

            {/* Core services list */}
            <Reveal delay={160}>
              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8] mb-2">
                    Core EMS Services
                  </p>
                  <h3 className="font-['JetBrains_Mono'] font-semibold text-lg text-[#0F172A] mb-4 leading-snug">
                    One-stop electronics manufacturing support from design to box build.
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {aboutServices.map((service, i) => (
                      <Reveal key={service} delay={i * 50}>
                        <span className="flex items-center gap-3 px-3 py-2 border border-[#E2E8F0] bg-[#f7f9fb] text-sm text-[#0F172A] rounded-xl">
                          <span className="w-8 h-8 flex items-center justify-center bg-[#c29f5d]/10 text-[#c29f5d] rounded-lg shrink-0">
                            {service === 'SMT Mounting' || service === 'Embedded Design' ? (
                              <Cpu size={16} />
                            ) : (
                              <Factory size={16} />
                            )}
                          </span>
                          <span>{service}</span>
                        </span>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ══ HIGHLIGHTS ════════════════════════════════════════ */}
        <div className="mb-10">
          <Reveal>
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8]">
                Why Choose Srilin
              </p>
              <h2 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-[#0F172A] mt-2">
                Reliable manufacturing capability with strategic scale and quality discipline.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutHighlights.map(({ icon: Icon, title, meta, text }, i) => (
              <Reveal key={title} delay={i * 80}>
                <article className="group bg-white border border-[#E2E8F0] p-6 flex flex-col gap-4 hover:border-[#c29f5d] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 flex items-center justify-center bg-[#c29f5d]/10 text-[#c29f5d] rounded-xl transition-all shrink-0">
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="font-['JetBrains_Mono'] font-semibold text-base text-[#0F172A] leading-snug">{title}</h3>
                      <p className="text-xs text-[#64748b] mt-1">{meta}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#44474d] leading-relaxed">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════ */}
      {/* <section className="bg-[#0F172A] relative overflow-hidden py-14 md:py-16">
        <div className="absolute right-10 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c29f5d]/40 to-transparent hidden md:block" />
        <div className="absolute right-16 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c29f5d]/20 to-transparent hidden md:block" />

        <Reveal>
          <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-lg">
              <h3 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-white mb-3">
                Interested in partnering or visiting?
              </h3>
              <p className="text-white/60 text-sm md:text-base leading-relaxed">
                Contact our sales and operations team to discuss capacity, audits, or a plant tour.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="mailto:info@srilinelectronics.com"
                className="inline-flex items-center justify-center gap-2 bg-[#c29f5d] text-[#0F172A] px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Building2 size={15} /> Contact Us
              </a>
              <a
                href="/about-us/career"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                View Careers
              </a>
            </div>
          </div>
        </Reveal>
      </section> */}

      <style>{`
        @keyframes aboutHeroIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cursorBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
