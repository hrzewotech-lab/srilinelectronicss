import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  ScanLine,
  Cpu,
  Gauge,
  Zap,
  Factory,
  CheckCircle2,
  ArrowRight,
  Wrench,
  RefreshCw,
  Droplet,
  Activity,
  Tag,
  Power,
  Binary,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   ANIMATION UTILITIES  (same system as HomePage / ServicesPage / ProductsPage / ContactPage)
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
const capabilityStats = [
  { value: '1,95,500+', label: 'Combined pick & place CPH capacity' },
  { value: '01005', label: 'Fine-pitch component support' },
  { value: '10-Zone', label: 'Nitrogen-ready reflow oven' },
  { value: '3D SPI + 3D AOI', label: 'Closed-loop inspection coverage' },
];

const processFlow = [
  { step: '01', label: 'Solder paste printing' },
  { step: '02', label: '3D SPI verification' },
  { step: '03', label: 'High-speed placement' },
  { step: '04', label: 'Nitrogen-ready reflow' },
  { step: '05', label: '3D AOI inspection' },
  { step: '06', label: 'Lab & utility support' },
];

const equipment = [
  {
    title: 'Solder Paste Printer',
    eyebrow: 'Fuji GPX-CII',
    image: '/machinery-img6.png',
    icon: Layers,
    category: 'Printing Stage',
    tag: 'Solder Paste Printer - Printed circuit board manufacturing India',
    summary: 'Fuji - GPX-CII Automated Solder Paste/Glue Printer.',
    details: [
      'Applicable panel size 48 x 48mm to 610 x 610mm.',
      'Alignment Accuracy: ± 0.010mm, 6σ [CpK≥2.0]',
      'Wet Printer Accuracy: ± 0.018mm, 6σ [CpK≥2.0]',
      'Printer Cycle time: 6.0 seconds (including panel loading, unloading, mark reading, mask alignment)',
      'Auto Paste Dispenser JAR type with Solder Roll Dia Check function.',
      'Stencil Cleaning: Dry + Wet + Vacuum.',
      'SPI Closed loop function.',
      'Local Verifier - with Handy Barcode Scanner.',
      'Automatic width adjustment.',
    ],
  },
  {
    title: '3D Solder Paste Inspection',
    eyebrow: 'Koh Young KY8080-L',
    image: '/machinery-img5.png',
    icon: ScanLine,
    category: 'Verification Stage',
    tag: '3D Solder Paste Inspection - EMS company India',
    summary: 'Koh Young inline 3D SPI– KY8080-L.',
    details: [
      'Printer Closed Loop Feedback.',
      'Camera Barcode reader.',
      'PCB Warp Compensation: Z Tracking.',
      'Detects Insufficient Paste, Excessive Paste, Missing‐Paste, Bridging, Shape Deformity, Paste Displacement, Volume, Height, XY Position, Area.',
      'Koh Young proprietary light projection unit for shadow free effect.',
      '4M B/W Digital Camera, 15um X/Y‐resolution (20/25um configurable from factory).',
      '0.37um Z resolution.',
      'SPC Plus software (Statistical Process Control).',
      'Applicable PCB Size 50mmx50mm to 510mmx510mm.',
      'No PCB color sensitivity.',
      'Min. Paste deposit supported up to 3.94 mils.',
      'Measurement Accuracy: < 1% on Calibration Target.',
      'Measurement Accuracy: < 3% on PCB.',
      'Measurement repeatability: < 10% on 01005 deposits @ 6 sigma [with 50% tolerance].',
      'KSMART LINK Software - Closed loop feedback from AOI to SPI.',
    ],
  },
  {
    title: 'Pick and Place Machines',
    eyebrow: 'Fuji AIMEX IIIc',
    image: '/machinery-img1.png',
    icon: Cpu,
    category: 'Placement Stage',
    tag: 'Pick and Place Machines - PCB Assembly services India',
    summary: 'Fuji- AIMEX IIIc – 2 Robot x 2 Modules with a capacity of 1,03,000 CPH.',
    details: [
      '48 x 48mm to 508mm x 400mm PCB handling capability.',
      'PBGA, FBGA, Micro-BGA, CSP, Ultra-fine pitch QFP & QFN mounting capability.',
      'Mounter accuracy of 0.025 mm, Cpk ≥ 1.00 (3σ).',
      'Supports Fine pitch components (01005 & 0201)',
      'Intelligent smart feeders (4mm to 72mm & 3 vibratory stick feeders).',
      'Fuji- AIMEX IIIc with Tray unit for chip & IC/BGA/other components mounting.',
      'Built‐in Auto Calibration and Hybrid calibration ensures placement accuracy to best level.',
      'Image processing is through CCD camera.',
      'FUJI Intelligent Feeders are of Variable pitch, electrically driven, Common for Paper & Emboss, Common for parts from 0402 mm (01005”) to 3225mm (1210”) parts size.',
      'Three Extra feeder carts for quick change over.',
      'Board level Traceability.',
      'Free Feeder Allocation.',
    ],
  },
  {
    title: 'Pick and Place Machine',
    eyebrow: 'Panasonic NPM-D3A',
    image: '/machinery-img4.png',
    icon: Cpu,
    category: 'Placement Stage',
    tag: 'Pick and Place Machine - SMT circuit board assembly',
    summary: 'Panasonic NPM-D3A Pick and Place Machine with 92500 CPH.',
    details: [
      'Board handling capacity of 50mm × 50mm ~ 510mm × 590mm.',
      'Mounter accuracy of 0.025 mm, Cpk ≥ 1.00 (3σ).',
      'Supports Fine pitch components (01005 & 0201).',
      'Intelligent smart feeders (4mm to 32mm).',
      'Two Extra feeder carts for quick change over.',
      'Built-in Auto Calibration and Hybrid calibration ensures placement accuracy to best level.',
      'Image processing is through CCD camera.',
      'Board level Traceability.',
      'Free Feeder Allocation.',
    ],
  },
  {
    title: 'Reflow Oven',
    eyebrow: 'JTR-1000N',
    image: '/machinery-img3.png',
    icon: Zap,
    category: 'Soldering Stage',
    tag: 'Reflow Oven - PCB design and manufacturing service',
    summary: 'JTR-1000N Reflow Oven with Nitrogen Ready.',
    details: [
      'Heating zones 10 Top and Bottom.',
      'Cooling Zones 3 Top and Bottom .',
      'In-built Thermal Profiler.',
      'Both Mesh & Chain Conveyors inbuilt.',
      'Automatic Lubrication System (Including Automatic chain oilers).',
      'Board Drop / Board Count Sensor with Animation.',
      'Reflow Profiler KIC –X5 9 channel with Carrier available.',
      'Camera Barcode Reader',
    ],
  },
  {
    title: '3D Automated Optical Inspection (AOI)',
    eyebrow: 'Koh Young ZENITH ALPHA HS+',
    image: '/machinery-img2.png',
    icon: ScanLine,
    category: 'Inspection Stage',
    tag: '3D Automated Optical Inspection AOI - Electronic product assembly India',
    summary: 'Koh Young Inline 3D Automated Optical inspection (AOI) ZENITH ALPHAHS+.',
    details: [
      '3D Inspection: Missing, Offset, Billboarding, Tombstone, Coplanarity, Solder Joint (insufficient, excessive), Lifted Leads, Bridging, "No‐Pops" Polarity.',
      '2D Inspection: "Wrong Part" using Optical Character Verification (OCV/R), Polarity.',
      'Camera Barcode Reader.',
      '8M Pixel 3D Camera.',
      'Maximum board handling capability of up to 490 x 510mm.',
      'OCV & OCR capability.',
      '25mm 3D Height Inspection capability.',
      '5 Way 3D Projector Lighting System.',
      'Auto Programming option & Offline programming software.',
      'KSMART LINK Software - Closed loop feedback from AOI to SPI.',
    ],
  },
];

const auxiliaryEquipment = [
  {
    name: 'Solder Paste Mixer',
    tag: 'Solder Paste Mixer',
    description: 'Ensures homogeneous paste viscosity and temperature stabilization prior to printing.',
    image: '/solder-paste-mixture.png',
    icon: RefreshCw,
  },
  {
    name: 'Stencil Cleaner',
    tag: 'Stencil Cleaner',
    description: 'High-performance cleaner utilizing dry, wet, and vacuum filtration to ensure residue-free stencils.',
    image: '/stencil-cleaner.png',
    icon: Droplet,
  },
  {
    name: '6 1/2 Digital Multimeter',
    tag: '6 1/2 Digital Multimeter',
    description: 'High-precision electrical measurement for engineering verification and Quality Assurance testing.',
    image: '/digital-multimeter.png',
    icon: Binary,
  },
  {
    name: 'Ultrasonic Welding Machine',
    tag: 'Ultrasonic Welding Machine',
    description: 'Precision ultrasonic welding system for enclosures and connectors.',
    image: '/ultrasonic-welding-machine.png',
    icon: Wrench,
  },
  {
    name: 'Oscilloscope',
    tag: 'Oscilloscope',
    description: 'High-bandwidth digital storage oscilloscope for signal integrity checks and troubleshooting.',
    image: '/oscilloscope.png',
    icon: Activity,
  },
  {
    name: 'Laser Marking',
    tag: 'Laser marking',
    description: 'Automated laser engraving for permanent PCB serial numbers and tracking codes.',
    image: '/laser-marking.png',
    icon: Tag,
  },
  {
    name: 'Power Supply',
    tag: 'Power Supply',
    description: 'Programmable DC power sources for comprehensive functional testing.',
    image: '/power-supply.png',
    icon: Power,
  },
];

const benchmarkRows = [
  {
    metric: 'Placement/Alignment Accuracy',
    values: ['±0.025 mm (Cpk ≥ 1.00)', '±0.025 mm (Cpk ≥ 1.00)', '±15 µm XY / 0.37 µm Z', '±0.010 mm Alignment'],
  },
  {
    metric: 'Throughput CPH',
    values: ['1,03,000 CPH', '92,500 CPH', 'N/A (Inline Inspection)', '6.0s Cycle Time'],
  },
  {
    metric: 'Inspection Type',
    values: ['CCD Vision Auto-Calibration', 'CCD Vision Auto-Calibration', '3D Shadow-Free AOI', '3D SPI / Closed-Loop Feedback'],
  },
  {
    metric: 'Smallest Component & Limits',
    values: ['01005 / 0201 support', '01005 / 0201 support', '25mm 3D Height Inspection', '3.94 mils Paste deposit'],
  },
];

export default function InfrastructureMachineryPage() {
  useEffect(() => {
    document.title = 'Infrastructure & Machinery - PCB Manufacturing Facilities | SriLin Electronics';
  }, []);

  const heroText = 'Precision Hardware. Zero Compromise.';
  const [typedHero, heroDone] = useTypewriter(heroText, 40);

  return (
    <div className="bg-[#f7f9fb] font-['Inter'] min-h-screen text-slate-800">

      {/* ── HERO ── */}
      <section
        className="relative w-full overflow-hidden bg-[#0F172A]
                   min-h-[340px] sm:min-h-[380px] md:min-h-[420px]
                   flex items-center"
      >
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80"
          alt="SMT pick and place machinery in operation"
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
            style={{ animation: 'imHeroIn 0.8s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            <p
              className="text-[#c29f5d] text-xs font-semibold uppercase tracking-widest mb-3 md:mb-4"
              style={{ animation: 'imHeroIn 0.6s 0.05s ease both' }}
            >
              Infrastructure &amp; Machinery - PCB Manufacturing Facilities
            </p>

            {/* Typewriter heading — "Precision Hardware." plain, "Zero Compromise." cyan */}
            <h1
              className="font-['JetBrains_Mono'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 md:mb-4"
              style={{ minHeight: '2.4em' }}
            >
              {(() => {
                const plain = 'Precision Hardware. ';
                if (typedHero.length <= plain.length) {
                  return (
                    <>
                      {typedHero}
                      {!heroDone && <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#f0c27b', marginLeft: 4, verticalAlign: 'middle', animation: 'imCursorBlink 0.75s step-end infinite' }} />}
                    </>
                  );
                }
                return (
                  <>
                    {plain.trim()}
                    <br />
                    <span className="text-[#f0c27b]">{typedHero.slice(plain.length)}</span>
                    {!heroDone && <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#f0c27b', marginLeft: 4, verticalAlign: 'middle', animation: 'imCursorBlink 0.75s step-end infinite' }} />}
                  </>
                );
              })()}
            </h1>

            <p
              className="text-white/75 text-sm sm:text-base leading-relaxed mb-5 md:mb-6 max-w-lg"
              style={{ opacity: heroDone ? 1 : 0, transform: heroDone ? 'none' : 'translateY(8px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            >
              Electronics manufacturing services Hyderabad India - PCB manufacturing facility.
              SriLin's SMT line combines automated printing, inline 3D inspection,
              and high-speed assembly — engineered for Class 3 reliability.
            </p>
            <div
              className="flex flex-wrap gap-2.5 sm:gap-3"
              style={{ opacity: heroDone ? 1 : 0, transition: 'opacity 0.5s 0.15s ease' }}
            >
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-[#c29f5d]/30 text-[#ffd199] text-xs font-semibold px-3 py-1.5 backdrop-blur-sm">
                <CheckCircle2 size={14} /> IPC-A-610 Class 3
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-[#c29f5d]/30 text-[#ffd199] text-xs font-semibold px-3 py-1.5 backdrop-blur-sm">
                <CheckCircle2 size={14} /> ESD S20.20 Certified
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-[#c29f5d]/30 text-[#ffd199] text-xs font-semibold px-3 py-1.5 backdrop-blur-sm">
                <CheckCircle2 size={14} /> ISO 13485:2016
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#c29f5d]/60 via-[#c29f5d]/10 to-transparent" />
      </section>



      {/* ── PCB MANUFACTURING FACILITIES HEADING + FULL IMAGE ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <Reveal>
          <h2 className="font-['JetBrains_Mono'] font-bold text-2xl sm:text-3xl md:text-4xl text-[#0F172A] text-center mb-10 leading-tight">
            Infrastructure &amp; Machinery –{' '}
            <span className="text-[#c29f5d]">PCB Manufacturing Facilities</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-[#E2E8F0]">
            <img
              src="/machinery-img7.png"
              alt="Infrastructure & Machinery - PCB Manufacturing Facilities"
              className="w-full h-auto object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* ── MACHINERY CARDS ── */}
      <section className="bg-[#eceef0] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-10">
              <p className="text-[#9a7a3e] text-xs font-semibold uppercase tracking-widest mb-2">
                Equipment Overview
              </p>
              <h2 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-[#0F172A] border-l-4 border-[#c29f5d] pl-4">
                Machinery on the Floor
              </h2>
              <p className="text-[#44474d] mt-3 max-w-2xl text-sm">
                Every machine in SriLin's SMT line is selected for precision, throughput, and long-term
                reliability across high-mix and high-volume production environments.
              </p>
            </div>
          </Reveal>

          <div className="space-y-8">
            {equipment.map(({ title, eyebrow, image, icon: Icon, tag, summary, details }, index) => {
              const isEven = index % 2 === 0;
              return (
                <Reveal key={title + eyebrow} delay={index * 80}>
                  <div
                    className="group bg-white border border-slate-200/80 hover:border-[#c29f5d] shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 rounded-lg overflow-hidden"
                  >
                    {/* Image Container with corrected column-span ratio & containment */}
                    <div
                      className={`lg:col-span-5 bg-slate-50 flex items-center justify-center p-8 border-b lg:border-b-0 ${isEven ? 'lg:border-r lg:order-1' : 'lg:border-l lg:order-2'
                        } border-slate-100`}
                    >
                      <div className="relative w-full h-full min-h-[220px] sm:min-h-[260px] lg:min-h-[320px] flex items-center justify-center">
                        <img
                          src={image}
                          alt={title}
                          className="max-w-full max-h-[240px] sm:max-h-[280px] lg:max-h-[320px] object-contain opacity-95 group-hover:opacity-100 group-hover:scale-102 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Content Container with modified ratio and padding */}
                    <div
                      className={`lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between gap-6 ${isEven ? 'lg:order-2' : 'lg:order-1'
                        }`}
                    >
                      {/* Card Header (metadata at the top) */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-[#9a7a3e] text-xs font-bold uppercase tracking-widest">
                            {eyebrow}
                          </span>
                        </div>

                        <h3 className="font-['JetBrains_Mono'] font-bold text-xl sm:text-2xl text-slate-900 leading-tight">
                          {title}
                        </h3>

                        <p className="text-[10px] text-slate-500/80 font-medium tracking-wide uppercase mt-0.5">
                          {tag}
                        </p>
                      </div>

                      {/* Summary */}
                      <p className="text-sm text-slate-600 leading-relaxed -mt-2">
                        {summary}
                      </p>

                      {/* Technical Details (2-column grid layout) */}
                      <div className="border-t border-slate-100 pt-5">
                        <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <Wrench size={12} className="text-[#9a7a3e]" strokeWidth={2.2} /> Technical Features &amp; Capabilities
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                          {details.map((detail) => (
                            <li key={detail} className="flex items-start gap-2 text-xs text-slate-600 leading-normal">
                              <CheckCircle2 size={13} className="text-[#9a7a3e] shrink-0 mt-0.5" strokeWidth={2.2} />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AUXILIARY & LAB EQUIPMENT ── */}
      <section className="bg-white py-16 md:py-20 border-t border-[#E2E8F0] border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-10 text-center md:text-left">
              <p className="text-[#9a7a3e] text-xs font-semibold uppercase tracking-widest mb-2">
                Factory Support Systems
              </p>
              <h2 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-[#0F172A] border-l-0 md:border-l-4 md:border-[#c29f5d] md:pl-4">
                Auxiliary &amp; Lab Infrastructure
              </h2>
              <p className="text-[#44474d] mt-3 max-w-2xl text-sm">
                A robust line-up of support tools, diagnostic instrumentation, and quality systems
                ensuring every manufactured board matches SriLin's high standards of quality.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auxiliaryEquipment.map(({ name, tag, description, image, icon: Icon }, index) => (
              <Reveal key={name} delay={index * 50} y={15}>
                <div className="group bg-white border border-[#E2E8F0] hover:border-[#c29f5d] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full rounded-lg overflow-hidden">

                  {image ? (
                    <div className="h-48 bg-slate-50 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden relative">
                      <img
                        src={image}
                        alt={name}
                        className="max-w-full max-h-full object-contain opacity-95 group-hover:opacity-100 group-hover:scale-103 transition-all duration-300"
                      />
                    </div>
                  ) : null}

                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      {/* <div className="flex items-center justify-between mb-3">
                        <span className="text-[#9a7a3e] text-[9px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                        <div className="text-slate-400 group-hover:text-[#9a7a3e] transition-colors">
                          <Icon size={16} strokeWidth={2} />
                        </div>
                      </div> */}

                      <h4 className="text-[#9a7a3e] text-[14px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                        {name}
                      </h4>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>

                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENCHMARK TABLE ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-[#9a7a3e] text-xs font-semibold uppercase tracking-widest mb-2">
              Technical Benchmarks
            </p>
            <h2 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-[#0F172A]">
              Machine Performance at a Glance
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="overflow-x-auto bg-white border border-[#E2E8F0] rounded-lg">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead>
                <tr className="bg-[#0F172A] text-white uppercase text-xs">
                  <th className="p-4 font-semibold">Metric</th>
                  <th className="p-4 font-semibold">Fuji AIMEX IIIc</th>
                  <th className="p-4 font-semibold">Panasonic NPM-D3A</th>
                  <th className="p-4 font-semibold">Koh Young 3D AOI</th>
                  <th className="p-4 font-semibold">Fuji Printer / Koh Young SPI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {benchmarkRows.map((row, i) => (
                  <tr
                    key={row.metric}
                    className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f7f9fb]'} hover:bg-[#c29f5d]/5 transition-colors duration-200`}
                  >
                    <td className="p-4 font-semibold text-[#0F172A] whitespace-nowrap">
                      {row.metric}
                    </td>
                    {row.values.map((v, idx) => (
                      <td key={idx} className="p-4 text-[#44474d] whitespace-nowrap font-['JetBrains_Mono'] text-xs">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      {/* <section className="bg-[#0F172A] relative overflow-hidden py-14 md:py-16">
        <div className="absolute right-10 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c29f5d]/40 to-transparent hidden md:block" />
        <div className="absolute right-16 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c29f5d]/20 to-transparent hidden md:block" />

        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Reveal className="max-w-lg">
            <h3 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-white mb-3">
              Want a facility walkthrough?
            </h3>
            <p className="text-white/60 text-sm md:text-base">
              Our engineering team can walk you through machine capabilities, line throughput,
              and compliance readiness for your specific assembly requirements.
            </p>
          </Reveal>
          <Reveal delay={120} className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/contact-us"
              className="inline-flex items-center justify-center gap-2 bg-[#c29f5d] text-[#0F172A] px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Schedule a Site Visit <ArrowRight size={16} />
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Download Equipment Specs
            </Link>
          </Reveal>
        </div>
      </section> */}

      <style>{`
        @keyframes imHeroIn     { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes imCursorBlink{ 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}