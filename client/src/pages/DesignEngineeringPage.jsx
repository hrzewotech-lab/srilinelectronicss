import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  FlaskConical,
  Layers,
  Microscope,
  MonitorDot,
  Pencil,
  Zap,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   ANIMATION UTILITIES  (same system as HomePage / ServicesPage / ProductsPage / ContactPage / InfrastructureMachineryPage)
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
    const el = ref.current;
    if (!el) return;
    if (!/^\d/.test(String(value))) { setDisplay(value); return; }
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

// --- DATA ---
const sections = [
  {
    title: 'Embedded Hardware Design Services',
    eyebrow: 'Core Offering',
    icon: Cpu,
    tag: 'Hardware Design',
    image: '/embedded-hardware.jpg',
    alt: 'Embedded hardware design services',
    body: 'Srilin Electronics offers comprehensive Embedded Hardware Design Services focused on delivering high-quality, reliable, and performance-driven electronic solutions. Our approach combines strong design expertise with rigorous validation processes to ensure that every product meets industry standards and customer expectations. A key strength of Srilin lies in its emphasis on schematic design, design enhancements, ECAD layout services, unit testing, and functional testing with integrated EMS services, which play a critical role in the success of embedded systems.',
  },
  {
    title: 'Design Enhancements',
    eyebrow: 'Optimisation',
    icon: Pencil,
    tag: 'Circuit Refinement',
    body: 'Srilin continuously improves hardware designs to achieve better performance, efficiency, and reliability. Design enhancements involve optimizing circuit layouts, selecting the most suitable components, and improving signal integrity and thermal management. The team evaluates existing designs to reduce power consumption, minimize noise, and enhance durability. These improvements ensure that the final product is technically robust, cost-effective, and scalable for production.',
  },
  {
    title: 'Unit Testing',
    eyebrow: 'Module-Level Validation',
    icon: Microscope,
    tag: 'Early-Stage QA',
    body: 'Unit testing is performed at the individual component or module level to verify that each part of the hardware functions correctly. At Srilin, engineers test smaller sections of the design such as power modules, communication interfaces, and processor units before integrating them into the complete system. This early-stage testing helps identify and resolve issues quickly, reducing development time and preventing costly errors in later stages.',
  },
  {
    title: 'Functional Testing',
    eyebrow: 'System-Level Validation',
    icon: FlaskConical,
    tag: 'End-to-End QA',
    body: 'Functional testing validates the complete hardware system against the required specifications and real-world operating conditions. Srilin conducts detailed testing to ensure that all components work together seamlessly and deliver the expected performance. This includes checking input/output operations, system responses, communication protocols, and overall system behavior. Functional testing ensures reliability, stability, and compliance with industry standards, making the product ready for deployment.',
  },
  {
    title: 'Embedded Software Services',
    eyebrow: 'Software Division',
    icon: MonitorDot,
    tag: 'Firmware & SW',
    image: '/embedded-software.jpg',
    alt: 'Embedded software and functional testing',
    body: 'Srilin Electronics provides advanced Embedded Software Services that complement its hardware design and manufacturing capabilities. The company focuses on developing reliable, scalable, and high-performance software solutions tailored for embedded systems across industries such as aerospace, defence, Space, AI, IOT, Industrial automation, and Medical, Railways, IT Hardware, Consumer Electronics, Automotive & EV & Telecom electronics. A key area of expertise includes LabVIEW test software and test application development, which ensure precise validation and control of electronic systems.',
  },
  {
    title: 'LabVIEW Test Software',
    eyebrow: 'National Instruments Platform',
    icon: Layers,
    tag: 'Automated Testing',
    body: 'Srilin specializes in developing test solutions using LabVIEW (Laboratory Virtual Instrument Engineering Workbench), a powerful platform from National Instruments. LabVIEW enables graphical programming for automated testing, data acquisition and system control. At Srilin, LabVIEW-based test software is designed to:',
    bullets: [
      'Automate complex testing procedures for electronic hardware',
      'Interface with instruments such as oscilloscopes, multimeters, and data acquisition systems',
      'Provide real-time data monitoring and analysis',
      'Improve accuracy and reduce manual intervention in testing processes',
      'These solutions are widely used in production environments and R&D labs to ensure consistent quality and faster testing cycles.',
    ],
  },
  {
    title: 'Test Applications',
    eyebrow: 'Custom Development',
    icon: Zap,
    tag: 'Validation SW',
    body: 'Srilin develops customized test applications to validate embedded systems under various operating conditions. These applications are tailored to meet specific product requirements and industry standards. Key features of Srilin’s test applications include:',
    bullets: [
      'Functional testing of embedded systems and subsystems',
      'Automated test sequences for production and validation ',
      'User-friendly interfaces for operators and engineers',
      'Data logging, reporting, and diagnostics for quality analysis',
      'Integration with hardware platforms and communication protocols',
      'These applications help identify defects early, ensure system reliability, and support compliance with stringent industry requirements.',
    ],
  },
];

export default function DesignEngineeringPage() {
  const heroText = 'Embedded Systems. Built to Last.';
  const [typedHero, heroDone] = useTypewriter(heroText, 40);

  return (
    <div className="bg-[#f7f9fb] font-['Inter'] min-h-screen">

      {/* ── HERO ── */}
      <section
        className="relative w-full overflow-hidden bg-[#0F172A]
                   min-h-[340px] sm:min-h-[380px] md:min-h-[420px]
                   flex items-center"
      >
        <img
          src="/embedded-software.jpg"
          alt="Precision circuit board engineering"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0F172A]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/85 to-[#0F172A]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-0">
          <div
            className="max-w-2xl border-l-2 border-[#c29f5d] pl-5 md:pl-6"
            style={{ animation: 'deHeroIn 0.8s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            <p
              className="text-[#c29f5d] text-xs font-semibold uppercase tracking-widest mb-3 md:mb-4"
              style={{ animation: 'deHeroIn 0.6s 0.05s ease both' }}
            >
              Design &amp; Engineering
            </p>

            {/* Typewriter heading — "Embedded Systems." plain, "Built to Last." cyan */}
            <h1
              className="font-['JetBrains_Mono'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 md:mb-4"
              style={{ minHeight: '2.4em' }}
            >
              {(() => {
                const plain = 'Embedded Systems. ';
                if (typedHero.length <= plain.length) {
                  return (
                    <>
                      {typedHero}
                      {!heroDone && <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#f0c27b', marginLeft: 4, verticalAlign: 'middle', animation: 'deCursorBlink 0.75s step-end infinite' }} />}
                    </>
                  );
                }
                return (
                  <>
                    {plain.trim()}
                    <br />
                    <span className="text-[#f0c27b]">{typedHero.slice(plain.length)}</span>
                    {!heroDone && <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#f0c27b', marginLeft: 4, verticalAlign: 'middle', animation: 'deCursorBlink 0.75s step-end infinite' }} />}
                  </>
                );
              })()}
            </h1>

            <p
              className="text-white/75 text-sm sm:text-base leading-relaxed mb-5 md:mb-6 max-w-lg"
              style={{ opacity: heroDone ? 1 : 0, transform: heroDone ? 'none' : 'translateY(8px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            >
              Srilin combines engineering depth, test discipline, and manufacturing awareness
              to help product teams build dependable embedded systems — from concept through
              full production validation.
            </p>
            <div
              className="flex flex-wrap gap-2.5 sm:gap-3"
              style={{ opacity: heroDone ? 1 : 0, transition: 'opacity 0.5s 0.15s ease' }}
            >
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-[#c29f5d]/30 text-[#ffd199] text-xs font-semibold px-3 py-1.5 backdrop-blur-sm">
                <CheckCircle2 size={14} /> Hardware Design
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-[#c29f5d]/30 text-[#ffd199] text-xs font-semibold px-3 py-1.5 backdrop-blur-sm">
                <CheckCircle2 size={14} /> LabVIEW Certified
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-[#c29f5d]/30 text-[#ffd199] text-xs font-semibold px-3 py-1.5 backdrop-blur-sm">
                <CheckCircle2 size={14} /> Functional Testing
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#c29f5d]/60 via-[#c29f5d]/10 to-transparent" />
      </section>

      {/* ── SPEC STRIP ── */}
      {/* <div className="bg-[#0F172A] border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-white/50 text-[10px] sm:text-[11px] tracking-wide text-center sm:text-left">
            Schematic Design &nbsp;•&nbsp; ECAD Layout &nbsp;•&nbsp; LabVIEW Test &nbsp;•&nbsp; Firmware Development &nbsp;•&nbsp; System Validation
          </p>
          <p className="text-[#c29f5d] font-['JetBrains_Mono'] text-xs tracking-widest text-center sm:text-right">
            SRILIN_ENG_DESIGN_V3
          </p>
        </div>
      </div> */}

      {/* ── SECTIONS ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20 space-y-6">

        {sections.map(({ title, eyebrow, icon: Icon, tag, image, alt, body, bullets }, index) => {
          const isEven = index % 2 === 0;
          const hasImage = !!image;

          return (
            <Reveal key={title} delay={index * 80}>
              <article
                className={`group bg-white border border-[#E2E8F0] overflow-hidden hover:border-[#c29f5d] hover:shadow-lg transition-all duration-300 rounded-2xl ${hasImage ? 'grid grid-cols-1 lg:grid-cols-12' : 'grid grid-cols-1'
                  }`}
              >
                {/* Image panel (only for sections with images) */}
                {hasImage && (
                  <div
                    className={`lg:col-span-4 h-56 lg:h-auto min-h-[220px] lg:min-h-[280px] bg-[#0F172A] flex items-center justify-center p-4 overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                  >
                    <img
                      src={image}
                      alt={alt || title}
                      className="max-w-full max-h-full object-contain opacity-85 group-hover:opacity-100 group-hover:scale-103 transition-all duration-500"
                    />
                  </div>
                )}

                {/* Content panel */}
                <div
                  className={`flex flex-col gap-5 p-7 md:p-10 ${hasImage
                    ? `lg:col-span-8 ${isEven ? 'lg:order-2' : 'lg:order-1'}`
                    : ''
                    }`}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[#9a7a3e] text-[10px] font-semibold uppercase tracking-widest mb-1">
                        {eyebrow}
                      </p>
                      <h2 className="font-['JetBrains_Mono'] font-bold text-xl md:text-2xl text-[#0F172A] leading-snug">
                        {title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-['JetBrains_Mono'] text-[#E2E8F0] text-2xl font-bold select-none hidden sm:block">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="w-10 h-10 flex items-center justify-center bg-[#c29f5d]/10 text-[#c29f5d] rounded-lg transition-colors">
                        <Icon size={20} strokeWidth={1.8} />
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <p className="text-sm text-[#44474d] leading-relaxed">{body}</p>

                  {/* Bullets */}
                  {bullets && (
                    <ul className={`grid gap-2.5 ${hasImage ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                      {bullets.map((bullet, bi) => (
                        <Reveal key={bullet} delay={bi * 60} y={10}>
                          <li className="flex items-start gap-2.5 text-sm text-[#44474d]">
                            <ArrowRight
                              size={14}
                              className="text-[#9a7a3e] shrink-0 mt-0.5"
                              strokeWidth={2}
                            />
                            {bullet}
                          </li>
                        </Reveal>
                      ))}
                    </ul>
                  )}

                  {/* Tag */}
                  <div className="pt-2 border-t border-[#E2E8F0] mt-auto">
                    <span className="inline-block text-[#c29f5d] text-[10px] font-semibold uppercase tracking-wider">
                      {tag}
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* ── CTA ── */}
      {/* <section className="bg-[#0F172A] relative overflow-hidden py-14 md:py-16">
        <div className="absolute right-10 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c29f5d]/40 to-transparent hidden md:block" />
        <div className="absolute right-16 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c29f5d]/20 to-transparent hidden md:block" />

        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Reveal className="max-w-lg">
            <h3 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-white mb-3">
              Have a design challenge?
            </h3>
            <p className="text-white/60 text-sm md:text-base">
              Talk to our embedded engineering team about your schematic, layout, firmware,
              or test requirements — we'll map out a validation plan from day one.
            </p>
          </Reveal>
          <Reveal delay={120} className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/contact-us"
              className="inline-flex items-center justify-center gap-2 bg-[#c29f5d] text-[#0F172A] px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Start a Design Brief <ArrowRight size={16} />
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              View Engineering Capabilities
            </Link>
          </Reveal>
        </div>
      </section> */}

      <style>{`
        @keyframes deHeroIn     { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes deCursorBlink{ 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}