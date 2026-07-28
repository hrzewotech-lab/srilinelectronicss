import { LoaderCircle, SearchX } from 'lucide-react';

export function AdminPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="admin-pagination">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
}

export function LoadingState({ label = 'Loading records' }) {
  return (
    <div className="admin-state">
      <LoaderCircle className="spin" size={22} />
      <strong>{label}</strong>
      <span>Please wait while the latest data is prepared.</span>
    </div>
  );
}

export function EmptyState({ title = 'No records yet', text = 'Create your first item using the form above.' }) {
  return (
    <div className="admin-state">
      <SearchX size={24} />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

export function MiniStat({ icon: Icon, label, value, tone = 'blue' }) {
  return (
    <article className={`mini-stat tone-${tone}`}>
      <span className="mini-stat-icon">
        <Icon size={18} />
      </span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </article>
  );
}
