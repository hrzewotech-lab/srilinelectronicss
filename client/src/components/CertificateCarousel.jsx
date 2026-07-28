import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Award, ShieldCheck, X } from 'lucide-react';
import api from '../api/axios';

/* ── Fallback certificates with real local images ── */
const fallbackCertificates = [
  { _id: 'fc-1', name: 'AS9100D',             subtitle: 'Aerospace Quality Management',   image: { url: '/certificate-01.jpg' } },
  { _id: 'fc-2', name: 'ISO 9001:2015',        subtitle: 'Quality Management System',       image: { url: '/certificate-02.jpg' } },
  { _id: 'fc-3', name: 'ANSI ESD S20.20 2021', subtitle: 'Electrostatic Discharge Control', image: { url: '/certificate-2026.jpg' } },
  { _id: 'fc-4', name: 'IATF 16949',           subtitle: 'Automotive Quality Management',   image: { url: '/iatf-cert.jpg'        } },
];

export default function CertificateCarousel() {
  const [certificates, setCertificates] = useState([]);
  const [activeIndex, setActiveIndex]   = useState(0);
  const [isPaused, setIsPaused]         = useState(false);
  const [cardsToShow, setCardsToShow]   = useState(1);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const trackRef = useRef(null);

  /* ── Load from API ── */
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get('/certificates');
        const loaded = (res.data.certificates || []).filter((c) => c.image?.url);
        if (isMounted) setCertificates(loaded.length ? loaded : fallbackCertificates);
      } catch {
        if (isMounted) setCertificates(fallbackCertificates);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  /* ── Responsive cards to show listener ── */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(3);
      } else if (window.innerWidth >= 768) {
        setCardsToShow(2);
      } else {
        setCardsToShow(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = certificates.length;
  const maxIndex = Math.max(0, total - cardsToShow);

  /* ── Auto-advance ── */
  useEffect(() => {
    if (total < 2 || isPaused) return;
    const t = setInterval(() => {
      setActiveIndex((p) => (p >= maxIndex ? 0 : p + 1));
    }, 3500);
    return () => clearInterval(t);
  }, [total, isPaused, maxIndex]);

  if (!certificates.length) return null;

  const goTo = (i) => {
    if (maxIndex <= 0) {
      setActiveIndex(0);
    } else {
      setActiveIndex((i + maxIndex + 1) % (maxIndex + 1));
    }
  };

  return (
    <section
      className="relative bg-white py-16 md:py-24 overflow-hidden border-y border-[#E2E8F0]"
      aria-label="Quality certifications"
    >
      {/* subtle gold grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(194,159,93,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(194,159,93,0.04) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12">

        <div className="mb-10 md:mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9a7a3e]">Quality Certifications</span>
              <span className="flex-1 h-px bg-[#E2E8F0] max-w-[60px]" />
            </div>
            <h2 className="font-['JetBrains_Mono'] font-bold text-[#0F172A] leading-tight"
              style={{ fontSize: 'clamp(1.3rem,3vw,1.9rem)', maxWidth: 480 }}>
              Recognized standards behind dependable manufacturing.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748b]" style={{ maxWidth: 440 }}>
              Certifications that support our commitment to consistent quality and production discipline.
            </p>
          </div>
        </div>

        {/* ── Slider track (overflow hidden window) ── */}
        <div className="relative px-10 sm:px-14" ref={trackRef}>
          {/* prev button */}
          <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous certificate"
            className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 border border-[#E2E8F0] bg-white text-[#334155] hover:border-[#c29f5d] hover:text-[#9a7a3e] rounded-full transition-all shadow-sm z-10">
            <ChevronLeft size={20} />
          </button>

          <div className="overflow-hidden">
            {/* sliding rail */}
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] gap-4 md:gap-6"
              style={{ transform: `translateX(calc(-${activeIndex * (100 / cardsToShow)}% - ${activeIndex * (16 / cardsToShow)}px))` }}
            >
              {certificates.map((cert, i) => (
                <div
                  key={cert._id || i}
                  className="shrink-0 cursor-pointer"
                  style={{ width: `calc(${100 / cardsToShow}% - ${(16 * (cardsToShow - 1)) / cardsToShow}px)` }}
                  aria-hidden={i < activeIndex || i >= activeIndex + cardsToShow}
                  onClick={() => setSelectedCertificate(cert)}
                >
                  {/* ── Card ── */}
                  <div className="border border-[#E2E8F0] bg-white overflow-hidden hover:border-[#c29f5d]/50 hover:shadow-xl transition-all duration-300 group h-full flex flex-col justify-between rounded-2xl">

                    {/* full certificate image */}
                    <div className="relative bg-[#f8fafc] flex items-center justify-center flex-1 rounded-t-2xl"
                      style={{ minHeight: 280, maxHeight: 380 }}>
                      {cert.image?.url ? (
                        <img
                          src={cert.image.url}
                          alt={cert.name}
                          className="w-full h-full object-contain rounded-t-2xl"
                          style={{ maxHeight: 340, padding: '1.5rem', display: 'block' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                          <div className="inline-flex h-16 w-16 items-center justify-center border border-[#c29f5d]/30 bg-[#c29f5d]/05 rounded-xl">
                            <ShieldCheck size={32} className="text-[#c29f5d]" />
                          </div>
                          <span className="font-['JetBrains_Mono'] font-bold text-[#0F172A] text-xl">{cert.name}</span>
                        </div>
                      )}
                      {/* gold top accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                        style={{ background: 'linear-gradient(90deg,#c29f5d,#9a7a3e,transparent)' }} />
                    </div>

                    {/* name / subtitle label */}
                    <div className="flex items-center gap-3 px-5 py-4 border-t border-[#E2E8F0] bg-white rounded-b-2xl">
                      <ShieldCheck size={16} className="text-[#9a7a3e] shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-['JetBrains_Mono'] font-bold text-[#0F172A] text-xs md:text-sm leading-tight">{cert.name}</span>
                        {cert.subtitle && (
                          <span className="text-[10px] md:text-xs text-[#64748b] mt-0.5">{cert.subtitle}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* next button */}
          <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next certificate"
            className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 border border-[#E2E8F0] bg-white text-[#334155] hover:border-[#c29f5d] hover:text-[#9a7a3e] rounded-full transition-all shadow-sm z-10">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* ── Progress bar ── */}
        <div className="mt-8 h-0.5 bg-[#E2E8F0] overflow-hidden">
          <div
            key={`cp-${activeIndex}`}
            className="h-full"
            style={{
              background: 'linear-gradient(90deg,#c29f5d,#9a7a3e)',
              animation: isPaused ? 'none' : 'certProgress 3.5s linear forwards',
            }}
          />
        </div>

        {/* ── Controls Indicator Dots ── */}
        {maxIndex > 0 && (
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center gap-2">
              {[...Array(maxIndex + 1)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Certificate Group ${i + 1}`}
                  aria-current={i === activeIndex ? 'true' : undefined}
                  style={{
                    width:  i === activeIndex ? 28 : 8,
                    height: 6,
                    borderRadius: 3,
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    background: i === activeIndex ? '#c29f5d' : 'rgba(194,159,93,0.25)',
                    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <CertificateModal certificate={selectedCertificate} onClose={() => setSelectedCertificate(null)} />

      <style>{`
        @keyframes certProgress { from { width:0%; } to { width:100%; } }
        @keyframes cOverlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cPanelIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </section>
  );
}

/* ── Modal Lightbox Component ── */
function CertificateModal({ certificate, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!certificate) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-[#0F172A]/90 backdrop-blur-md cursor-zoom-out pt-20"
      onClick={onClose}
      style={{ animation: 'cOverlayIn 0.2s ease both' }}
    >
      {/* Lightbox Image Container */}
      <div 
        className="relative max-w-4xl w-full flex flex-col items-center justify-center p-2 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'cPanelIn 0.25s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {/* Visible solid white close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close viewer"
          className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 z-50 inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-[#0F172A] hover:bg-[#eceef0] hover:text-[#9a7a3e] transition-colors shadow-2xl border border-[#CBD5E1]"
        >
          <X size={20} />
        </button>

        <img
          src={certificate.image?.url}
          alt={certificate.name}
          className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-xl"
        />
        
        {/* Caption */}
        <div className="text-center mt-6">
          <h3 className="font-['JetBrains_Mono'] font-bold text-lg md:text-xl text-[#c29f5d] leading-none mb-2">{certificate.name}</h3>
          {certificate.subtitle && (
            <p className="text-xs md:text-sm text-white/60">{certificate.subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
