import { Link } from 'react-router-dom';
import { BadgeCheck, Building2, Cpu, Factory, MapPin, ShieldCheck, Smile, TrendingUp } from 'lucide-react';
import heroGraphic from '../assets/hero.png';

const aboutStats = [
  { value: '2017', label: 'Established' },
  { value: '25,000', label: 'Sqft current facility' },
  { value: '214,000', label: 'Sqft expansion space' },
  { value: 'ISO-8', label: 'Cleanroom class' },
];

const certificationBadges = ['ISO9001:2015', 'AS9100D', 'ANSI ESD S20.20 2021', 'IEC 61340 5.1'];

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

const pageContent = {
  'about-us': {
    eyebrow: 'About SriLin',
    title: 'Precision-led electronics manufacturing with dependable delivery.',
    description:
      'SriLin supports product teams with engineering discipline, production readiness, and quality-focused execution across electronic assemblies and industrial solutions.',
    points: ['Experienced engineering support', 'Quality-first production systems', 'Customer-focused delivery model'],
  },
  'about-company': {
    eyebrow: 'About Company',
    title: 'A focused electronics manufacturing partner for growing product teams.',
    description:
      'SriLin combines engineering awareness, organized infrastructure, and delivery discipline to support reliable electronic product development and manufacturing.',
    points: ['Manufacturing-focused leadership', 'Industrial production environment', 'Long-term customer partnership'],
  },
  team: {
    eyebrow: 'Our Team',
    title: 'A practical team built around engineering clarity and execution.',
    description:
      'Our people bring together production coordination, technical support, quality awareness, and customer communication for dependable project outcomes.',
    points: ['Engineering coordination', 'Production support', 'Quality and customer success'],
  },
  career: {
    eyebrow: 'Career',
    title: 'Build meaningful electronics manufacturing work with SriLin.',
    description:
      'We welcome people who care about precision, learning, teamwork, and building electronic products that support real industrial requirements.',
    points: ['Growth-focused environment', 'Hands-on technical exposure', 'Collaborative workplace culture'],
  },
  services: {
    eyebrow: 'Services',
    title: 'End-to-end support from idea validation to production scale.',
    description:
      'Our service model brings design guidance, prototyping, sourcing, assembly coordination, testing, and lifecycle support into one practical workflow.',
    points: ['Product development support', 'PCB assembly coordination', 'Testing, validation, and documentation'],
  },
  'pcba-capabilities': {
    eyebrow: 'PCBA Capabilities',
    title: 'Reliable PCB assembly capability for prototype and production needs.',
    description:
      'SriLin supports electronic assembly with SMT-focused production workflows, inspection discipline, and scalable manufacturing coordination.',
    points: ['SMT assembly support', 'Prototype to volume production', 'Traceable production process'],
  },
  'x-ray-inspection': {
    eyebrow: 'X-Ray Inspection Services',
    title: 'Inspection support for high-reliability electronic assemblies.',
    description:
      'X-ray inspection helps identify hidden assembly defects and supports confident production for complex PCB and electronic systems.',
    points: ['Hidden joint inspection', 'Quality validation', 'Critical assembly review'],
  },
  'box-build-integration': {
    eyebrow: 'Box Build Integration',
    title: 'Complete product integration beyond board assembly.',
    description:
      'SriLin supports box build workflows including assembly coordination, product integration, and readiness checks for complete electronic systems.',
    points: ['Product integration', 'Assembly coordination', 'Final build support'],
  },
  'testing-services': {
    eyebrow: 'Testing Services',
    title: 'Testing workflows that support dependable electronic products.',
    description:
      'Our testing support helps teams validate function, quality, and production readiness before shipment and deployment.',
    points: ['Functional testing', 'Validation support', 'Final inspection'],
  },
  'embedded-design': {
    eyebrow: 'Embedded Design Services',
    title: 'Embedded design support for practical, manufacturable products.',
    description:
      'We support embedded product requirements with design awareness, component practicality, and manufacturing-focused engineering thinking.',
    points: ['Embedded systems support', 'Design refinement', 'Manufacturing readiness'],
  },
  'ecad-layout': {
    eyebrow: 'ECAD Layout Services',
    title: 'ECAD layout support shaped around production success.',
    description:
      'Layout decisions influence performance, manufacturability, and reliability. SriLin helps teams move toward cleaner production-ready designs.',
    points: ['PCB layout support', 'DFM awareness', 'Design documentation'],
  },
  'design-engineering': {
    eyebrow: 'Design & Engineering',
    title: 'Engineering built around manufacturability, reliability, and speed.',
    description:
      'We help teams move from concepts to production-ready designs with careful attention to component selection, layout constraints, performance, and serviceability.',
    points: ['Circuit and system design support', 'Prototype refinement', 'Design for manufacturing reviews'],
  },
  industries: {
    eyebrow: 'Industries',
    title: 'Solutions for businesses that need durable electronic systems.',
    description:
      'SriLin serves customers across industrial, commercial, infrastructure, automation, and technology-led environments where reliability matters every day.',
    points: ['Industrial electronics', 'Automation and controls', 'Commercial technology applications'],
  },
  products: {
    eyebrow: 'Products',
    title: 'Purpose-built products shaped by practical engineering.',
    description:
      'Explore electronic products and assemblies developed for performance, maintainability, and consistent use in demanding business environments.',
    points: ['Custom electronic assemblies', 'Control and interface modules', 'Application-specific product builds'],
  },
  'infrastructure-machinery': {
    eyebrow: 'Infrastructure & Machinery',
    title: 'Production capability backed by organized infrastructure.',
    description:
      'Our infrastructure is designed to support structured manufacturing workflows, inspection readiness, and dependable delivery for growing product requirements.',
    points: ['Organized production workflow', 'Inspection-ready processes', 'Scalable machinery support'],
  },
  resources: {
    eyebrow: 'Resources',
    title: 'Insights, documentation, and updates for customers and partners.',
    description:
      'Find company updates, technical notes, FAQs, and useful resources that help teams understand SriLin capabilities and project workflows.',
    points: ['Technical resources', 'Company updates', 'Support and FAQs'],
  },
  blog: {
    eyebrow: 'Blog',
    title: 'Ideas and updates from the electronics manufacturing floor.',
    description:
      'Read practical notes on product engineering, manufacturing readiness, quality workflows, infrastructure, and SriLin company updates.',
    points: ['Manufacturing insights', 'Product development notes', 'Company news'],
  },
  faqs: {
    eyebrow: 'FAQs',
    title: 'Answers to common questions about working with SriLin.',
    description:
      'Find quick answers about services, project discussions, production support, quality processes, and how to begin a new requirement.',
    points: ['Project onboarding', 'Service process', 'Quality and delivery questions'],
  },
  'contact-us': {
    eyebrow: 'Contact Us',
    title: 'Talk to SriLin about your next electronics requirement.',
    description:
      'Share your product, production, or service requirement and our team will help you identify the right next step.',
    points: ['+91 73850 69999', 'info@srilinelectronics.com', 'E-City EMC, Raviryala Village, Telangana'],
  },
};

function AboutCompanyPage() {
  return (
    <section className="about-company-page">
      <div className="about-company-hero">
        <div className="about-company-media">
          <div className="about-company-visual">
            <img src="/about-us2.png" alt="SriLin electronics manufacturing services graphic" />
            <div className="about-company-badge">
              <Building2 size={20} />
              <span>E-City EMC, Hyderabad</span>
            </div>
          </div>
        </div>
        <div className="about-company-copy">
          <p className="public-eyebrow">About Company</p>
          <h1>Srilin Electronics Private Limited</h1>
          <p>
            Srilin Electronics Pvt Ltd is an ISO9001:2015, AS9100D, ANSI ESD S20.20 2021 & IEC 61340 5.1 certified Premier Electronics System Design & Manufacturing Services (ESDM/EMS) company located in E-city EMC (Formerly Fabcity), Hyderabad, India. The company was established in 2017 to help the developing interest of Electronic Assembling in India. Our one-stop-solution electronics manufacturing services (EMS) factory incorporates quick prototyping, mid-range volume production to high volume production.
          </p>
          <p>
            We provide Embedded Design, SMT Mounting, Product Integration, Testing & Box Build services. Our products are manufactured using Robust and advanced SMT machinery in Class 100000 (ISO-8) Cleanroom to meet worldwide quality standards. We also provide comprehensive supply chain management. We offer our services to a wide range of customers for their product development and support them in manufacturing scalability and production flexibility. SRILIN has been the preferred value partner for its clients through innovative and efficient electronic system assembly.
          </p>
          <div className="about-cert-list" aria-label="Srilin certifications">
            {certificationBadges.map((certification) => (
              <span key={certification}>
                <ShieldCheck size={16} />
                {certification}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="about-data-section">
        <div className="about-stat-grid">
          {aboutStats.map((stat) => (
            <article className="about-stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>
        <div className="about-service-panel">
          <div>
            <p className="section-kicker">Core EMS Services</p>
            <h2>One-stop electronics manufacturing support from design to box build.</h2>
          </div>
          <div className="about-service-list">
            {aboutServices.map((service) => (
              <span key={service}>
                {service === 'SMT Mounting' || service === 'Embedded Design' ? <Cpu size={17} /> : <Factory size={17} />}
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="about-why-section">
        <div className="section-heading centered">
          <p className="section-kicker">Why Choose Srilin</p>
          <h2>Reliable manufacturing capability with strategic scale and quality discipline.</h2>
        </div>
        <div className="about-highlight-grid">
          {aboutHighlights.map(({ icon: Icon, title, text }) => (
            <article className="about-highlight-card" key={title}>
              <span><Icon size={22} /></span>
              <h3>{title}</h3>
              <strong>{meta}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PublicPage({ type }) {
  if (type === 'about-company') {
    return <AboutCompanyPage />;
  }

  const content = pageContent[type] || pageContent['about-us'];

  return (
    <section className="public-page">
      <div className="public-page-hero">
        <p className="public-eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <Link className="public-cta" to="/contact-us">
          Contact Us
        </Link>
      </div>

      <div className="public-feature-grid">
        {content.points.map((point) => (
          <article className="public-feature-card" key={point}>
            <span />
            <h2>{point}</h2>
            <p>
              Built with a practical focus on clarity, repeatability, and outcomes that support
              real-world electronic product requirements.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
