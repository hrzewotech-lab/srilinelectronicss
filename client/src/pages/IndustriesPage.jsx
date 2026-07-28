import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Plane,
  Cpu,
  Wifi,
  BatteryCharging,
  Train,
  Bot,
  Activity,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const industries = [
  {
    name: 'Automotive',
    icon: Car,
    description:
      'EV battery management, ADAS sensor suites, and infotainment assembly. Compliant with IATF 16949 quality management standards.',
    tag: 'Zero-Defect Goal',
  },
  {
    name: 'Aviation, Space & Defence',
    icon: Plane,
    description:
      'High-reliability PCBA for avionics, flight control systems, and engine management. Strict adherence to AS9100D and vibration-resistance specs.',
    tag: 'NADCAP Accredited',
  },
  {
    name: 'IT Hardware & Consumer Electronics',
    icon: Cpu,
    description:
      'High-mix, high-volume SMT assembly for computing peripherals and consumer-grade devices, balancing speed with quality control.',
    tag: 'High-Mix Capable',
  },
  {
    name: 'Telecom',
    icon: Wifi,
    description:
      'Next-gen 5G infrastructure, satellite comms, and base station assemblies. Specialized in high-frequency RF substrate handling.',
    tag: 'RF Optimization',
  },
  {
    name: 'Electric Vehicles',
    icon: BatteryCharging,
    description:
      'Battery pack electronics, charging infrastructure, and power control modules engineered for thermal stress and high-current reliability.',
    tag: 'Thermal-Rated',
  },
  {
    name: 'Railways',
    icon: Train,
    description:
      'Signaling systems, onboard control units, and rolling stock electronics built to meet long-lifecycle and harsh-environment standards.',
    tag: 'EN 50155 Aligned',
  },
  {
    name: 'AI, IoT & Automation',
    icon: Bot,
    description:
      'Rapid prototyping for edge computing nodes, AI accelerators, and industrial IoT sensors with complex chip-on-board requirements.',
    tag: 'Rapid Scale-Up',
  },
  {
    name: 'Medical Devices',
    icon: Activity,
    description:
      'Life-saving diagnostic equipment and surgical robotics. Clean-room SMT lines certified to ISO 13485 with full traceability.',
    tag: 'Traceability V4.0',
  },
];

const benchmarkRows = [
  {
    metric: 'IPC Standard',
    values: ['Class 3 (Critical)', 'Class 2/3 (Life-critical)', 'Class 2 (Dedicated)'],
  },
  {
    metric: 'AOI Frequency',
    values: ['100% Post-Reflow', '100% Multi-Stage', 'Batch Statistical'],
  },
  {
    metric: 'Cleanliness',
    values: ['Ionic Contam. Test', 'Class 10k Cleanroom', 'Standard ESD-Safe'],
  },
  {
    metric: 'Traceability',
    values: ['Individual Serial', 'Lot & Comp. Level', 'Batch ID Track'],
  },
];

function useTypewriter(text, speed = 40) {
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setTyped('');
    setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        clearInterval(id);
      }
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.08 }
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

export default function IndustriesPage() {
  const heroText = 'Global Precision. Industry Standards.';
  const [typedHero, heroDone] = useTypewriter(heroText, 45);
  return (
    <div className="bg-[#f7f9fb] font-['Inter'] min-h-screen">
      {/* HERO */}
      <section
        className="relative w-full overflow-hidden bg-[#0F172A]
                   min-h-[340px] sm:min-h-[380px] md:min-h-[420px]
                   flex items-center"
      >
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80"
          alt="Precision circuit board manufacturing"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlays for legibility */}
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
          <Reveal delay={80} className="max-w-2xl border-l-2 border-[#c29f5d] pl-5 md:pl-6">
            <p className="text-[#c29f5d] text-xs font-semibold uppercase tracking-widest mb-3 md:mb-4">
              Market Verticals
            </p>
            <h1 className="font-['JetBrains_Mono'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 md:mb-4">
              {(() => {
                const firstLine = 'Global Precision.';
                const secondLine = 'Industry Standards.';
                const hasSecond = typedHero.length > firstLine.length;
                return (
                  <>
                    <span>{typedHero.slice(0, firstLine.length)}</span>
                    {hasSecond && (
                      <>
                        <br />
                        <span className="text-[#f0c27b]">{typedHero.slice(firstLine.length)}</span>
                      </>
                    )}
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
                  </>
                );
              })()}
            </h1>
            <p
              className="text-white/75 text-sm sm:text-base leading-relaxed mb-5 md:mb-6 max-w-lg"
              style={{
                opacity: heroDone ? 1 : 0,
                transform: heroDone ? 'none' : 'translateY(8px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              Providing mission-critical EMS and ESDM services across sectors where
              reliability isn't just an option — it's the foundation of every circuit.
            </p>
            <div
              className="flex flex-wrap gap-2.5 sm:gap-3"
              style={{
                opacity: heroDone ? 1 : 0,
                transform: heroDone ? 'none' : 'translateY(8px)',
                transition: 'opacity 0.5s 0.2s ease, transform 0.5s 0.2s ease',
              }}
            >
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-[#c29f5d]/30 text-[#ffd199] text-xs font-semibold px-3 py-1.5 backdrop-blur-sm">
                <CheckCircle2 size={14} /> AS9100D Certified
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-[#c29f5d]/30 text-[#ffd199] text-xs font-semibold px-3 py-1.5 backdrop-blur-sm">
                <CheckCircle2 size={14} /> IATF 16949
              </span>
            </div>
          </Reveal>
        </div>

        {/* Bottom edge accent line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#c29f5d]/60 via-[#c29f5d]/10 to-transparent" />
      </section>

      {/* SPEC STRIP */}
      {/* <div className="bg-[#0F172A] border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-white/50 text-[10px] sm:text-[11px] tracking-wide text-center sm:text-left">
            ISO 13485:2016 &nbsp;•&nbsp; IPC-A-610 CLASS 3 &nbsp;•&nbsp; MIL-PRF-31032 &nbsp;•&nbsp; ESD S20.20
          </p>
          <p className="text-[#c29f5d] font-['JetBrains_Mono'] text-xs tracking-widest text-center sm:text-right">
            SRILIN_SPEC_99.9
          </p>
        </div>
      </div> */}

      {/* INDUSTRY CARDS */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20">
        <Reveal delay={80} className="mb-10">
          <h2 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-[#0F172A] border-l-4 border-[#c29f5d] pl-4">
            Specialized EMS Solutions
          </h2>
          <p className="text-[#44474d] mt-3 max-w-2xl">
            Our technical clean-room environments are optimized for the specific
            regulatory and performance demands of eight core global industries.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {industries.map(({ name, icon: Icon, description }, index) => (
            <Reveal key={name} delay={index * 70}>
              <div className="group bg-white border border-[#E2E8F0] p-6 flex flex-col gap-4 hover:border-[#c29f5d] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full rounded-2xl">
                <div className="w-11 h-11 flex items-center justify-center bg-[#c29f5d]/10 text-[#c29f5d] rounded-xl transition-all">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-['JetBrains_Mono'] font-semibold text-lg text-[#0F172A] mb-2 leading-snug">
                    {name}
                  </h3>
                  <p className="text-sm text-[#44474d] leading-relaxed">{description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BENCHMARK TABLE */}
      <section className="bg-[#eceef0] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Reveal delay={80} className="text-center mb-10">
            <p className="text-[#9a7a3e] text-xs font-semibold uppercase tracking-widest mb-2">
              The Manufacturing Edge
            </p>
            <h2 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-[#0F172A]">
              Clinical Standards Benchmarks
            </h2>
          </Reveal>

          <Reveal delay={120} className="overflow-x-auto bg-white border border-[#E2E8F0]">
            <table className="w-full text-left text-sm min-w-[640px]">
              <thead>
                <tr className="bg-[#0F172A] text-white uppercase text-xs">
                  <th className="p-4 font-semibold">Metric Category</th>
                  <th className="p-4 font-semibold">Aviation / Defense</th>
                  <th className="p-4 font-semibold">Medical Grade</th>
                  <th className="p-4 font-semibold">Industrial IoT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {benchmarkRows.map((row, i) => (
                  <tr key={row.metric} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f7f9fb]'}>
                    <td className="p-4 font-semibold text-[#0F172A] whitespace-nowrap">
                      {row.metric}
                    </td>
                    {row.values.map((v, idx) => (
                      <td key={idx} className="p-4 text-[#44474d] whitespace-nowrap">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      {/* <section className="bg-[#0F172A] relative overflow-hidden py-14 md:py-16">
        <div className="absolute right-10 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c29f5d]/40 to-transparent hidden md:block" />
        <div className="absolute right-16 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c29f5d]/20 to-transparent hidden md:block" />

        <Reveal delay={100} className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-lg">
            <h3 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-white mb-3">
              Ready for a technical deep-dive?
            </h3>
            <p className="text-white/60 text-sm md:text-base">
              Connect with our engineering team to review your BOM and industry-specific
              compliance requirements.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/contact-us"
              className="inline-flex items-center justify-center gap-2 bg-[#c29f5d] text-[#0F172A] px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Request Technical Quote <ArrowRight size={16} />
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Download Capability Matrix
            </Link>
          </div>
        </Reveal>
      </section> */}
    </div>
  );
}