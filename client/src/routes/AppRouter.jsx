import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import RequireAdmin from '../components/RequireAdmin';
import AdminLayout from '../components/AdminLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import SectionPage from '../pages/SectionPage';
import AboutCompanyPage from '../pages/AboutCompanyPage';
import InfrastructureMachineryPage from '../pages/InfrastructureMachineryPage';
import ContactPage from '../pages/ContactPage';
import DesignEngineeringPage from '../pages/DesignEngineeringPage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import BlogsPage from '../pages/BlogsPage';
import BlogDetailPage from '../pages/BlogDetailPage';
import FaqsPage from '../pages/FaqsPage';
import LoginPage from '../pages/LoginPage';
import AdminHome from '../pages/AdminHome';
import AdminUsers from '../pages/AdminUsers';
import AdminHero from '../pages/AdminHero';
import AdminClients from '../pages/AdminClients';
import AdminBlog from '../pages/AdminBlog';
import AdminProducts from '../pages/AdminProducts';
import AdminServices from '../pages/AdminServices';
import AdminTeam from '../pages/AdminTeam';
import AdminFaqs from '../pages/AdminFaqs';
import AdminSettings from '../pages/AdminSettings';
import AdminCertificates from '../pages/AdminCertificates';
import ServicesPage from '../pages/ServicesPage';
import ServiceDetailPage from '../pages/ServiceDetailPage';
import CareersPage from '../pages/CareersPage';
import TeamPage from '../pages/TeamPage';
import IndustriesPage from '../pages/IndustriesPage';

export default function AppRouter() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';
  const showPublicChrome = !isAdminRoute && !isLoginRoute;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <SEO />
      {showPublicChrome && <Navbar />}
      <main className={`main-content ${isAdminRoute ? 'admin-main-page' : ''} ${isLoginRoute ? 'login-main-page' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about-us" element={<AboutCompanyPage />} />
          <Route path="/about-us/company" element={<AboutCompanyPage />} />
          <Route path="/about-us/team" element={<TeamPage />} />
          <Route path="/about-us/career" element={<CareersPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          {/* Commented out static service capability routes so they load dynamic database data via /services/:id */}
          {/* <Route path="/services/pcba-capabilities" element={<SectionPage eyebrow="PCBA Capabilities" title="Reliable PCB assembly capability for prototype and production needs." description="SriLin supports electronic assembly with SMT-focused production workflows, inspection discipline, and scalable manufacturing coordination." points={['SMT assembly support', 'Prototype to volume production', 'Traceable production process']} />} /> */}
          {/* <Route path="/services/x-ray-inspection" element={<SectionPage eyebrow="X-Ray Inspection Services" title="Inspection support for high-reliability electronic assemblies." description="X-ray inspection helps identify hidden assembly defects and supports confident production for complex PCB and electronic systems." points={['Hidden joint inspection', 'Quality validation', 'Critical assembly review']} />} /> */}
          {/* <Route path="/services/box-build-integration" element={<SectionPage eyebrow="Box Build Integration" title="Complete product integration beyond board assembly." description="SriLin supports box build workflows including assembly coordination, product integration, and readiness checks for complete electronic systems." points={['Product integration', 'Assembly coordination', 'Final build support']} />} /> */}
          {/* <Route path="/services/testing-services" element={<SectionPage eyebrow="Testing Services" title="Testing workflows that support dependable electronic products." description="Our testing support helps teams validate function, quality, and production readiness before shipment and deployment." points={['Functional testing', 'Validation support', 'Final inspection']} />} /> */}
          {/* <Route path="/services/embedded-design" element={<SectionPage eyebrow="Embedded Design Services" title="Embedded design support for practical, manufacturable products." description="We support embedded product requirements with design awareness, component practicality, and manufacturing-focused engineering thinking." points={['Embedded systems support', 'Design refinement', 'Manufacturing readiness']} />} /> */}
          {/* <Route path="/services/ecad-layout" element={<SectionPage eyebrow="ECAD Layout Services" title="ECAD layout support shaped around production success." description="Layout decisions influence performance, manufacturability, and reliability. SriLin helps teams move toward cleaner production-ready designs." points={['PCB layout support', 'DFM awareness', 'Design documentation']} />} /> */}
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/design-engineering" element={<DesignEngineeringPage />} />
          <Route path="/industries" element={<SectionPage eyebrow="Industries" title="Solutions for businesses that need durable electronic systems." description="SriLin serves customers across industrial, commercial, infrastructure, automation, and technology-led environments where reliability matters every day." points={['Industrial electronics', 'Automation and controls', 'Commercial technology applications']} />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/infrastructure-machinery" element={<InfrastructureMachineryPage />} />
          <Route path="/resources" element={<SectionPage eyebrow="Resources" title="Insights, documentation, and updates for customers and partners." description="Find company updates, technical notes, FAQs, and useful resources that help teams understand SriLin capabilities and project workflows." points={['Technical resources', 'Company updates', 'Support and FAQs']} />} />
          <Route path="/resources/blog" element={<BlogsPage />} />
          <Route path="/resources/blog/:id" element={<BlogDetailPage />} />
          <Route path="/resources/faqs" element={<FaqsPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="hero" element={<AdminHero />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="faqs" element={<AdminFaqs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>
      {showPublicChrome && <Footer />}
    </div>
  );
}
