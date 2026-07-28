import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Globe } from 'lucide-react';
import api from '../api/axios';
import { slugify } from '../utils/slugify';

const baseNavItems = [
  { label: 'Home', path: '/' },
  {
    label: 'About Us',
    path: '/about-us/company',
    children: [
      { label: 'About Company', path: '/about-us/company' },
      { label: 'Our Team', path: '/about-us/team' },
      { label: 'Career', path: '/about-us/career' },
    ],
  },
  { label: 'Services', path: '/services' },
  { label: 'Design & Engineering', path: '/design-engineering' },
  { label: 'Industries', path: '/industries' },
  { label: 'Products', path: '/products' },
  { label: 'Infrastructure & Machinery', path: '/infrastructure-machinery' },
  {
    label: 'Resources',
    path: '/resources/blog',
    children: [
      { label: 'Blog', path: '/resources/blog' },
      { label: 'FAQs', path: '/resources/faqs' },
    ],
  },
  { label: 'Contact Us', path: '/contact-us' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'zh-CN', name: '中文 (Chinese)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [services, setServices] = useState([]);
  const [activeLang, setActiveLang] = useState('en');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const getActiveLang = () => {
      const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
      return match ? match[1] : 'en';
    };
    setActiveLang(getActiveLang());

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ar,bn,zh-CN,fr,de,gu,hi,kn,ml,mr,es,ta,te',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    };

    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleLanguageChange = (code) => {
    if (code === 'en') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    } else {
      document.cookie = `googtrans=/en/${code}; path=/;`;
      document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname};`;
    }
    window.location.reload();
  };

  useEffect(() => {
    let isMounted = true;
    api.get('/services')
      .then((res) => {
        if (isMounted) {
          const list = Array.isArray(res?.data?.services) ? res.data.services : [];
          setServices(list.filter((s) => s && s.isActive !== false));
        }
      })
      .catch((err) => console.error('Navbar services fetch failed:', err));
    return () => { isMounted = false; };
  }, []);

  const navItems = baseNavItems.map((item) => {
    if (item.label === 'Services' && services.length > 0) {
      return {
        ...item,
        children: services.map((s) => ({
          label: s.title,
          path: `/services/${slugify(s.title)}`,
        })),
      };
    }
    return item;
  });


  useEffect(() => {
    setIsOpen(false);
    setExpandedMenu(null);
    setHoveredItem(null);
  }, [location.pathname]);

  const handleToggle = () => {
    setIsOpen((current) => {
      if (current) setExpandedMenu(null);
      return !current;
    });
  };

  const closeMenu = () => {
    setIsOpen(false);
    setExpandedMenu(null);
    setHoveredItem(null);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleDropdownClick = () => {
    closeMenu();
  };

  const toggleSubmenu = (path) => {
    setExpandedMenu((current) => (current === path ? null : path));
  };

  return (
    <>
      <header className="site-header">
        <NavLink to="/" className="site-brand" onClick={closeMenu}>
          <img src="/srilin-white.png" alt="Srilin Electronics" width="112" height="64" />
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen}
          onClick={handleToggle}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`site-nav ${isOpen ? 'open' : ''}`} aria-label="Primary navigation">
          {navItems.map((item) => {
            const itemId = `submenu-${item.path.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
            const isExpanded = expandedMenu === item.path;

             return (
              <div 
                className={`site-nav-item ${hasChildren ? 'has-children' : ''}`} 
                key={item.path}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <span>{item.label}</span>
                  {hasChildren && <ChevronDown className="nav-chevron-desktop" size={14} strokeWidth={3} />}
                </NavLink>

                {hasChildren && (
                  <>
                    <button
                      type="button"
                      className={`submenu-toggle ${isExpanded ? 'expanded' : ''}`}
                      aria-expanded={isExpanded}
                      aria-controls={itemId}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        toggleSubmenu(item.path);
                      }}
                    >
                      <ChevronDown size={18} />
                    </button>
                    <div
                      id={itemId}
                      className={`site-dropdown ${isExpanded ? 'open' : ''} ${hoveredItem === item.path ? 'desktop-open' : ''}`}
                      aria-label={`${item.label} submenu`}
                    >
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) => `site-dropdown-link ${isActive ? 'active' : ''}`}
                          onClick={handleDropdownClick}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </nav>
      </header>
      <div className="site-header-spacer" aria-hidden="true" />

      {/* Hidden container for Google Translate script callbacks */}
      <div id="google_translate_element" style={{ display: 'none' }} />

      {/* Premium custom Language floating Drop-up widget */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 font-sans">
        <div className="relative">
          {isLangOpen && (
            <ul 
              className="absolute bottom-full right-0 mb-3 w-48 sm:w-56 max-h-64 overflow-y-auto bg-[#0F172A] border border-[#c29f5d]/30 shadow-2xl py-2 rounded-2xl text-left z-50 divide-y divide-white/5 scrollbar-thin scrollbar-thumb-[#c29f5d]/50"
              style={{ maxHeight: '260px', overflowY: 'auto' }}
            >
              {languages.map((lang) => (
                <li key={lang.code}>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between ${
                      activeLang === lang.code
                        ? 'text-[#c29f5d] bg-[#c29f5d]/10'
                        : 'text-white/80 hover:text-[#c29f5d] hover:bg-white/5'
                    }`}
                  >
                    <span>{lang.name}</span>
                    {activeLang === lang.code && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c29f5d] shadow-[0_0_8px_#c29f5d]" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] text-white border border-[#c29f5d]/50 shadow-2xl hover:border-[#c29f5d] hover:bg-[#1E293B] transition-all rounded-full font-sans text-xs font-semibold tracking-wide whitespace-nowrap"
            style={{ boxShadow: '0 8px 30px rgba(194, 159, 93, 0.25)' }}
          >
            <Globe size={14} className="text-[#c29f5d] animate-[spin_20s_linear_infinite]" />
            <span>{languages.find(l => l.code === activeLang)?.name.split(' ')[0] || 'English'}</span>
            <ChevronDown size={12} className={`text-[#c29f5d] transform transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <style>{`
        /* Hide native Google Translate banner and elements completely */
        .goog-te-banner-frame.skiptranslate,
        .goog-te-banner,
        .goog-te-balloon-frame,
        #goog-gt-tt,
        .goog-tooltip,
        .goog-tooltip:hover {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        body {
          top: 0px !important;
        }
      `}</style>
    </>
  );
}
