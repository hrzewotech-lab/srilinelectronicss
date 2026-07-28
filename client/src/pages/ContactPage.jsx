import { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Phone, Send, MessageSquare } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   ANIMATION UTILITIES  (same system as HomePage / ServicesPage / ProductsPage)
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

/* ════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const whatsappNumber = '917385069999';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Hello SriLin,%0A%0AName: ${encodeURIComponent(formData.name)}%0AEmail: ${encodeURIComponent(formData.email)}%0APhone: ${encodeURIComponent(formData.phone)}%0ASubject: ${encodeURIComponent(formData.subject)}%0AMessage: ${encodeURIComponent(formData.message)}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  const contactCards = [
    // {
    //   icon: Phone,
    //   title: 'Phone',
    //   value: '+91 73850 69999',
    //   sub: 'Mon – Sat, 9 AM – 6 PM IST',
    //   href: 'tel:+917385069999',
    // },
    {
      icon: Mail,
      title: 'Email',
      value: 'sales@srilinelectronics.com',
      sub: 'We reply within one business day',
      href: 'mailto:sales@srilinelectronics.com',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'PLOT: S-1/P/D, E-City EMC',
      sub: 'Raviryala, Maheshwaram, Ranga Reddy, Telangana – 501359',
      href: 'https://www.google.com/maps/search/?api=1&query=SRILIN+ELECTRONICS+PRIVATE+LIMITED',
    },
  ];

  const heroText = 'Talk to SriLin. Start Building.';
  const [typedHero, heroDone] = useTypewriter(heroText, 40);

  return (
    <div className="bg-[#f7f9fb] font-['Inter'] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden bg-[#0F172A] min-h-[340px] sm:min-h-[380px] md:min-h-[420px] flex items-center">
        <img
          src="/image.png"
          alt="Electronics manufacturing floor"
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
            style={{ animation: 'ctHeroIn 0.8s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            <p
              className="text-[#c29f5d] text-xs font-semibold uppercase tracking-widest mb-3 md:mb-4"
              style={{ animation: 'ctHeroIn 0.6s 0.05s ease both' }}
            >
              Contact Us
            </p>

            {/* Typewriter heading — "Talk to SriLin." plain, "Start Building." cyan */}
            <h1
              className="font-['JetBrains_Mono'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 md:mb-4"
              style={{ minHeight: '2.4em' }}
            >
              {(() => {
                const plain = 'Talk to Srilin. ';
                const accent = 'Start Building.';
                if (typedHero.length <= plain.length) {
                  return (
                    <>
                      {typedHero}
                      {!heroDone && <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#f0c27b', marginLeft: 4, verticalAlign: 'middle', animation: 'ctCursorBlink 0.75s step-end infinite' }} />}
                    </>
                  );
                }
                return (
                  <>
                    {plain.trim()}
                    <br />
                    <span className="text-[#f0c27b]">{typedHero.slice(plain.length)}</span>
                    {!heroDone && <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#f0c27b', marginLeft: 4, verticalAlign: 'middle', animation: 'ctCursorBlink 0.75s step-end infinite' }} />}
                  </>
                );
              })()}
            </h1>

            <p
              className="text-white/75 text-sm sm:text-base leading-relaxed mb-5 md:mb-6 max-w-lg"
              style={{ opacity: heroDone ? 1 : 0, transform: heroDone ? 'none' : 'translateY(8px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            >
              Share your product, production, or service requirement and our engineering
              team will identify the right next step for you.
            </p>
            <div
              className="flex flex-wrap gap-2.5 sm:gap-3"
              style={{ opacity: heroDone ? 1 : 0, transition: 'opacity 0.5s 0.15s ease' }}
            >

            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#c29f5d]/60 via-[#c29f5d]/10 to-transparent" />
      </section>



      {/* ── CONTACT CARDS ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <Reveal>
          <div className="mb-10">
            <h2 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-[#0F172A] border-l-4 border-[#c29f5d] pl-4">
              Get in Touch
            </h2>
            <p className="text-[#44474d] mt-3 max-w-2xl">
              Reach us through any channel — our team is ready to respond to your
              technical enquiries, RFQs, and partnership requests.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {contactCards.map(({ icon: Icon, title, value, sub, href }, i) => (
            <Reveal key={title} delay={i * 100}>
              <a
                href={href}
                target={title === 'Address' ? '_blank' : undefined}
                rel={title === 'Address' ? 'noopener noreferrer' : undefined}
                className="group bg-white border border-[#E2E8F0] p-6 flex flex-col gap-4 hover:border-[#c29f5d] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full rounded-2xl text-left no-underline block"
              >
                <div className="w-11 h-11 flex items-center justify-center bg-[#eceef0] text-[#0F172A] group-hover:bg-[#c29f5d]/10 group-hover:text-[#9a7a3e] transition-colors rounded-xl">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-['JetBrains_Mono'] font-semibold text-lg text-[#0F172A] mb-1">
                    {title}
                  </h3>
                  <p className="text-sm font-semibold text-[#0F172A] mb-1">{value}</p>
                  <p className="text-xs text-[#64748b] leading-relaxed">{sub}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-[#E2E8F0]">
                  <span className="inline-block bg-[#ffffff] text-[#c29f5d] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md group-hover:bg-[#c29f5d] group-hover:text-white transition-colors">
                    {title === 'Phone' ? 'Call Direct' : title === 'Email' ? 'Write to Us' : 'Visit Us'}
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* ── CONTACT FORM ── */}
        <Reveal delay={150}>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
            {/* Form header bar */}
            <div className="bg-[#0F172A] px-6 py-4 flex items-center justify-between">
              <h3 className="font-['JetBrains_Mono'] font-bold text-white text-base sm:text-lg">
                Send Your Requirement
              </h3>
              <span className="text-[#c29f5d] font-['JetBrains_Mono'] text-xs tracking-widest hidden sm:block">
                VIA WHATSAPP
              </span>
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  {[
                    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'Your email' },
                    { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Your phone number' },
                    { id: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g. PCB Assembly Inquiry' },
                  ].map(({ id, label, type, placeholder }, i) => (
                    <Reveal key={id} delay={i * 60} y={14} className="flex flex-col gap-2">
                      <label
                        htmlFor={id}
                        className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]"
                      >
                        {label}
                      </label>
                      <input
                        id={id}
                        name={id}
                        type={type}
                        value={formData[id]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        required
                        className="w-full px-4 py-3 border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#c29f5d] focus:ring-1 focus:ring-[#c29f5d]/40 transition-colors bg-[#f7f9fb]"
                      />
                    </Reveal>
                  ))}
                </div>

                <Reveal delay={240} y={14}>
                  <div className="flex flex-col gap-2 mb-6">
                    <label
                      htmlFor="message"
                      className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your product, production volume, or service requirement…"
                      required
                      className="w-full px-4 py-3 border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#c29f5d] focus:ring-1 focus:ring-[#c29f5d]/40 transition-colors bg-[#f7f9fb] resize-vertical min-h-[140px]"
                    />
                  </div>
                </Reveal>

                <Reveal delay={300} y={14}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <p className="text-xs text-[#64748b]">
                      Your message will open in WhatsApp — review before sending.
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3 text-sm font-bold transition-colors hover:-translate-y-0.5 active:translate-y-0"
                      style={{ transition: 'transform 0.2s ease, background-color 0.2s ease' }}
                    >
                      <Send size={15} />
                      Send on WhatsApp
                    </button>
                  </div>
                </Reveal>
              </form>
            </div>
          </div>
        </Reveal>

        {/* ── GOOGLE MAP ── */}
        <Reveal delay={200}>
          <div className="mt-14 bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm">
            <h3 className="font-['JetBrains_Mono'] font-bold text-[#0F172A] text-lg mb-4 pl-2 border-l-4 border-[#c29f5d]">
              Our Location
            </h3>
            <div className="w-full h-[400px] sm:h-[450px] rounded-xl overflow-hidden relative border border-[#E2E8F0]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1951390.4510336884!2d76.05560302734375!3d17.203769821917533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba5aa089189cd%3A0x446e4978ad7eea49!2sSRILIN%20ELECTRONICS%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1783442292637!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Srilin Electronics Private Limited Location Map"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0F172A] relative overflow-hidden py-14 md:py-16">
        <div className="absolute right-10 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c29f5d]/40 to-transparent hidden md:block" />
        <div className="absolute right-16 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c29f5d]/20 to-transparent hidden md:block" />

        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Reveal className="max-w-lg">
            <h3 className="font-['JetBrains_Mono'] font-bold text-2xl md:text-3xl text-white mb-3">
              Need a technical deep-dive?
            </h3>
            <p className="text-white/60 text-sm md:text-base">
              Our engineers are ready to review your BOM, discuss industry-specific
              compliance, and propose the optimal manufacturing approach.
            </p>
          </Reveal>
          <Reveal delay={120} className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="mailto:info@srilinelectronics.com"
              className="inline-flex items-center justify-center gap-2 bg-[#c29f5d] text-[#0F172A] px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Mail size={15} /> Email Us
            </a>
            <a
              href={`https://wa.me/917385069999`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <MessageSquare size={15} /> WhatsApp Us
            </a>
          </Reveal>
        </div>
      </section>

      <style>{`
        @keyframes ctHeroIn     { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ctCursorBlink{ 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}