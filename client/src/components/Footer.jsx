import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import api from '../api/axios';
import { slugify } from '../utils/slugify';

const footerLinks = [
  ['About Us', '/about-us/company'],
  ['Our Team', '/about-us/team'],
  ['Career', '/about-us/career'],
  ['Design & Engineering', '/design-engineering'],
  ['Industries', '/industries'],
  ['Products', '/products'],
  ['Resources', '/resources/blog'],
];

export default function Footer() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api.get('/services')
      .then((res) => {
        if (isMounted) {
          const list = Array.isArray(res?.data?.services) ? res.data.services : [];
          setServices(list.filter((s) => s && s.isActive !== false));
        }
      })
      .catch((err) => console.error('Footer services fetch failed:', err));
    return () => { isMounted = false; };
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand-block">
          <span className="footer-logo"><img src="/srilin-white.png" alt="Srilin Electronics" /></span>

          <small>
            "SRILIN ELECTRONICS PRIVATE LIMITED", is a registered company under the Companies Act, 2013 (18 of 2013). It is having its Registered Office in the State of Telangana.
          </small>

          {/* Social Media Links */}
          <div className="flex items-center gap-4 mt-6">

            <a href="https://www.facebook.com/share/1YZoEwWDgn/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-[#c9c9cf] hover:text-[#c29f5d] transition-colors" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>

            <a href="https://www.instagram.com/srilin_electronics_pvtltd?igsh=ZXI3aXZteHhyaDl4" target="_blank" rel="noopener noreferrer" className="text-[#c9c9cf] hover:text-[#c29f5d] transition-colors" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            <a href="https://x.com/akhilnandepu?s=21" target="_blank" rel="noopener noreferrer" className="text-[#c9c9cf] hover:text-[#c29f5d] transition-colors" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>

            <a href="https://www.linkedin.com/in/akhil-nandepu-7a250276?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener noreferrer" className="text-[#c9c9cf] hover:text-[#c29f5d] transition-colors" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            <a href="https://youtube.com/@srilinelectronicsprivatelimite?si=_RoDbU84-my2Zi8v" target="_blank" rel="noopener noreferrer" className="text-[#c9c9cf] hover:text-[#c29f5d] transition-colors" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          {footerLinks.slice(0, 3).map(([label, path]) => (
            <Link key={path} to={path}>{label}</Link>
          ))}
        </div>

        <div className="footer-column">
          <h4>Services</h4>
          {services.slice(0, 5).map((service) => (
            <Link key={service._id} to={`/services/${slugify(service.title)}`}>
              {service.title}
            </Link>
          ))}
          {services.length > 5 && (
            <Link to="/services" className="font-semibold text-[#c29f5d] hover:text-white transition-colors">
              All Services →
            </Link>
          )}
          {services.length === 0 && (
            <>
              <Link to="/services/embedded-design-services">Embedded Design</Link>
              <Link to="/services/pcba-capabilities">PCBA Capabilities</Link>
              <Link to="/services/testing-services">Testing Services</Link>
            </>
          )}
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          {footerLinks.slice(3).map(([label, path]) => (
            <Link key={path} to={path}>{label}</Link>
          ))}
          <Link to="/infrastructure-machinery">Infrastructure & Machinery</Link>
        </div>

        <div className="footer-column footer-contact">
          <h4>Contact</h4>
          {/* <a href="tel:+917385069999" className="footer-contact-item">
            <Phone size={16} className="footer-contact-icon" />
            <span>+91 73850 69999</span>
          </a> */}
          <a href="mailto:sales@srilinelectronics.com" className="footer-contact-item">
            <Mail size={16} className="footer-contact-icon" />
            <span>sales@srilinelectronics.com</span>
          </a>
          <a
            href="https://maps.google.com/?q=PLOT:+S-1/P/D,+E-City+EMC,+Raviryala+Village,+Maheshwaram+Mandal,+Ranga+Reddy+District,+Telangana+-+501359"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-item"
          >
            <MapPin size={16} className="footer-contact-icon" />
            <span>PLOT: S-1/P/D, E-City EMC, Raviryala Village, Maheshwaram Mandal, Ranga Reddy District, Telangana - 501359</span>
          </a>
        </div>
      </div>

      <div className="footer-disclaimer-row">
        <p className="footer-disclaimer-text">
          Disclaimer: Srilin Electronics Private Limited / its management holds no responsibility for any inaccuracies in this website and reserves the right to revise this website without notice and clients refers to the immediate clients or through the subcontract from our clients.
        </p>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Srilin Electronics Private Limited. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/contact-us">Contact Us</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
