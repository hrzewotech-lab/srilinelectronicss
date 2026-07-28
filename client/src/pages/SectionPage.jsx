import { Link } from 'react-router-dom';

export default function SectionPage({ eyebrow, title, description, points, ctaTo = '/contact-us' }) {
  return (
    <section className="public-page">
      <div className="public-page-hero">
        <p className="public-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link className="public-cta" to={ctaTo}>
          Contact Us
        </Link>
      </div>

      <div className="public-feature-grid">
        {points.map((point) => (
          <article className="public-feature-card" key={point.title || point}>
            <span />
            <h2>{point.title || point}</h2>
            <p>{point.text || 'Built with a practical focus on clarity, repeatability, and outcomes that support real-world electronic product requirements.'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
