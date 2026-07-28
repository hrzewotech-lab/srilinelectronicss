import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://www.srilinelectronics.com';
const SITE_NAME = 'SriLin Electronics Private Limited';
const DEFAULT_IMAGE = `${SITE_URL}/SrilinLogo_NSG.png`;

const defaultMeta = {
  title: 'SriLin Electronics | Electronics Manufacturing Services in Hyderabad, India',
  description:
    'SriLin Electronics provides electronics manufacturing services, PCB assembly, embedded hardware and software design, testing, and SMT infrastructure support in Hyderabad, India.',
  keywords:
    'SriLin Electronics, electronics manufacturing services Hyderabad, PCB assembly India, EMS company India, SMT assembly, embedded hardware design, embedded software services, PCB manufacturing facility',
};

const pageMeta = {
  '/': defaultMeta,
  '/about': {
    title: 'About SriLin Electronics | EMS Company in Hyderabad, India',
    description:
      'Learn about SriLin Electronics Private Limited, an electronics manufacturing and engineering partner supporting reliable electronic product development and production.',
    keywords: 'about SriLin Electronics, EMS company Hyderabad, electronics manufacturing company India',
  },
  '/about-us': {
    title: 'About SriLin Electronics | Electronics Manufacturing Company',
    description:
      'Explore SriLin Electronics company profile, manufacturing focus, quality approach, and electronics engineering capabilities.',
    keywords: 'SriLin Electronics company, electronics manufacturing Hyderabad, PCB assembly company India',
  },
  '/about-us/company': {
    title: 'Company Profile | SriLin Electronics Private Limited',
    description:
      'SriLin Electronics supports customers with electronics design, manufacturing infrastructure, quality workflows, and dependable delivery.',
    keywords: 'SriLin Electronics Private Limited, company profile, EMS Hyderabad India',
  },
  '/about-us/team': {
    title: 'Team | SriLin Electronics',
    description:
      'Meet the SriLin Electronics team supporting electronics design, manufacturing, testing, and customer delivery.',
    keywords: 'SriLin Electronics team, electronics manufacturing team, EMS engineering team',
  },
  '/about-us/career': {
    title: 'Careers | SriLin Electronics',
    description:
      'Explore career opportunities with SriLin Electronics in electronics manufacturing, engineering, quality, and operations.',
    keywords: 'SriLin Electronics careers, electronics manufacturing jobs Hyderabad, EMS careers India',
  },
  '/services': {
    title: 'Electronics Manufacturing Services | SriLin Electronics',
    description:
      'Explore SriLin Electronics services including PCB assembly, box build integration, testing, embedded design, ECAD layout, and inspection support.',
    keywords: 'electronics manufacturing services, PCB assembly services India, box build integration, testing services, embedded design services',
  },
  '/services/pcba-capabilities': {
    title: 'PCBA Capabilities | PCB Assembly Services India',
    description:
      'SriLin Electronics provides SMT-focused PCB assembly capability for prototype, pilot, and production electronic assemblies.',
    keywords: 'PCBA capabilities, PCB assembly services India, SMT assembly Hyderabad, printed circuit board assembly',
  },
  '/services/x-ray-inspection': {
    title: 'X-Ray Inspection Services | SriLin Electronics',
    description:
      'X-ray inspection support for high-reliability electronic assemblies, hidden solder joint review, and critical PCB validation.',
    keywords: 'X-Ray inspection services, PCB inspection India, electronics assembly inspection',
  },
  '/services/box-build-integration': {
    title: 'Box Build Integration Services | SriLin Electronics',
    description:
      'Complete product integration and box build assembly support for electronic systems beyond PCB assembly.',
    keywords: 'box build integration, electronic product assembly India, EMS box build services',
  },
  '/services/testing-services': {
    title: 'Electronics Testing Services | SriLin Electronics',
    description:
      'Functional testing, validation support, and final inspection workflows for dependable electronic products.',
    keywords: 'electronics testing services, functional testing, PCB testing India, product validation',
  },
  '/services/embedded-design': {
    title: 'Embedded Design Services | SriLin Electronics',
    description:
      'Embedded hardware and software design support for manufacturable, reliable electronic products and systems.',
    keywords: 'embedded design services, embedded hardware design, embedded software services India',
  },
  '/services/ecad-layout': {
    title: 'ECAD Layout Services | PCB Layout Support',
    description:
      'ECAD layout support shaped around manufacturability, reliability, PCB performance, and production readiness.',
    keywords: 'ECAD layout services, PCB layout services India, DFM PCB design, electronics design support',
  },
  '/design-engineering': {
    title: 'Design & Engineering Services | Embedded Hardware and Software',
    description:
      'SriLin Electronics provides embedded hardware design, design enhancements, ECAD layout, unit testing, functional testing, LabVIEW test software, and test applications.',
    keywords: 'design engineering services, embedded hardware design services, LabVIEW test software, functional testing, unit testing',
  },
  '/industries': {
    title: 'Industries Served | SriLin Electronics',
    description:
      'SriLin Electronics serves industrial automation, infrastructure systems, consumer electronics, EV, telecom, IoT, medical, aerospace, defence, and product engineering customers.',
    keywords: 'industrial electronics, EV electronics, IoT electronics manufacturing, aerospace electronics, telecom electronics',
  },
  '/products': {
    title: 'Products | SriLin Electronics',
    description:
      'Explore SriLin Electronics products and electronic solutions backed by engineering, manufacturing, and testing capability.',
    keywords: 'SriLin Electronics products, electronic products India, electronics solutions',
  },
  '/infrastructure-machinery': {
    title: 'Infrastructure & Machinery | PCB Manufacturing Facilities Hyderabad',
    description:
      'View SriLin Electronics PCB manufacturing facilities including solder paste printer, 3D SPI, Fuji and Panasonic pick and place machines, reflow oven, 3D AOI, and production support equipment.',
    keywords:
      'PCB manufacturing facilities Hyderabad, electronics manufacturing services Hyderabad India, solder paste printer, 3D solder paste inspection, pick and place machine, reflow oven, 3D AOI',
  },
  '/resources': {
    title: 'Resources | SriLin Electronics',
    description:
      'Find SriLin Electronics resources, company updates, technical notes, FAQs, and manufacturing readiness information.',
    keywords: 'electronics manufacturing resources, EMS resources, PCB assembly FAQs, SriLin Electronics updates',
  },
  '/resources/blog': {
    title: 'Blog | SriLin Electronics',
    description:
      'Read SriLin Electronics articles on electronics manufacturing, engineering, PCB assembly, quality workflows, and company updates.',
    keywords: 'SriLin Electronics blog, electronics manufacturing blog, PCB assembly articles',
  },
  '/resources/faqs': {
    title: 'FAQs | SriLin Electronics',
    description:
      'Answers to common questions about SriLin Electronics services, project workflows, manufacturing capability, and customer support.',
    keywords: 'SriLin Electronics FAQs, EMS questions, PCB assembly questions',
  },
  '/contact-us': {
    title: 'Contact SriLin Electronics | EMS Company Hyderabad',
    description:
      'Contact SriLin Electronics for electronics manufacturing services, PCB assembly, embedded design, testing, and production requirements in Hyderabad, India.',
    keywords: 'contact SriLin Electronics, EMS Hyderabad contact, PCB assembly Hyderabad, electronics manufacturing enquiry',
  },
};

const dynamicMeta = [
  {
    match: /^\/services\/[^/]+$/,
    meta: {
      title: 'Service Details | SriLin Electronics',
      description:
        'View SriLin Electronics service details for electronics manufacturing, engineering, PCB assembly, testing, and production support.',
      keywords: 'SriLin Electronics services, electronics manufacturing service details, EMS services India',
    },
  },
  {
    match: /^\/products\/[^/]+$/,
    meta: {
      title: 'Product Details | SriLin Electronics',
      description:
        'View SriLin Electronics product details and electronic solutions supported by engineering and manufacturing capability.',
      keywords: 'SriLin Electronics products, electronic product details, electronics solutions India',
    },
  },
  {
    match: /^\/resources\/blog\/[^/]+$/,
    meta: {
      title: 'Blog Article | SriLin Electronics',
      description:
        'Read a SriLin Electronics article about electronics manufacturing, product engineering, PCB assembly, and quality workflows.',
      keywords: 'SriLin Electronics article, electronics manufacturing article, PCB assembly blog',
    },
  },
];

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function getMeta(pathname) {
  const normalizedPath = normalizePath(pathname);
  const exactMeta = pageMeta[normalizedPath];
  if (exactMeta) return exactMeta;

  const dynamicMatch = dynamicMeta.find((item) => item.match.test(normalizedPath));
  return dynamicMatch?.meta || defaultMeta;
}

function getBreadcrumbItems(pathname) {
  const normalizedPath = normalizePath(pathname);
  if (normalizedPath === '/' || normalizedPath.startsWith('/admin') || normalizedPath === '/login') {
    return [];
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  return segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: label,
      item: `${SITE_URL}${path}`,
    };
  });
}

export default function SEO() {
  const { pathname } = useLocation();
  const normalizedPath = normalizePath(pathname);
  const meta = getMeta(normalizedPath);
  const canonicalUrl = `${SITE_URL}${normalizedPath === '/' ? '' : normalizedPath}`;
  const isPrivateRoute = normalizedPath.startsWith('/admin') || normalizedPath === '/login';
  const breadcrumbs = getBreadcrumbItems(normalizedPath);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/SrilinLogo_NSG.png`,
        image: DEFAULT_IMAGE,
        email: 'info@srilinelectronics.com',
        telephone: '+91 73850 69999',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'PLOT: S-1/P/D, E-City EMC, Raviryala Village, Maheshwaram Mandal',
          addressLocality: 'Ranga Reddy District',
          addressRegion: 'Telangana',
          postalCode: '501359',
          addressCountry: 'IN',
        },
        areaServed: ['India', 'Hyderabad', 'Telangana'],
        knowsAbout: [
          'Electronics manufacturing services',
          'PCB assembly',
          'SMT assembly',
          'Embedded hardware design',
          'Embedded software services',
          'Testing services',
          'Box build integration',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'en-IN',
      },
    ],
  };

  const breadcrumbSchema = breadcrumbs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs,
      }
    : null;

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en-IN" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <meta name="robots" content={isPrivateRoute ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="author" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="theme-color" content="#071433" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />

      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      {breadcrumbSchema ? <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script> : null}
    </Helmet>
  );
}
