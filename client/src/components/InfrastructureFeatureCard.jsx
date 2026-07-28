export default function InfrastructureFeatureCard({ icon: Icon, title, description }) {
  return (
    <article className="infrastructure-feature-card">
      <div className="feature-icon-shell">
        <Icon size={22} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}
