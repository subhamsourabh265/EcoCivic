import { Link } from 'react-router';
import type { Category, Issue, Status } from '../domain';

const symbols: Record<Category, string> = {
  'Water wastage': '◉',
  'Waste & dumping': '▧',
  'Air pollution': '≋',
  'Public infrastructure': '▤',
  'Trees & greenery': '♧',
  Sewage: '≈',
  'Plastic waste': '↻',
};
export function CategoryIcon({ category }: { category: Category }) {
  return (
    <span
      className={`category-icon category-${category.split(' ')[0]?.toLowerCase()}`}
      aria-hidden="true"
    >
      {symbols[category]}
    </span>
  );
}
export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`badge status-${status.toLowerCase().replaceAll(' ', '-')}`}>
      <span aria-hidden="true">●</span> {status}
    </span>
  );
}
export function dateLabel(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}
export function LoadingState() {
  return (
    <div className="state-panel" role="status">
      <span className="spinner" aria-hidden="true" />
      <h2>Loading community reports…</h2>
      <p>Getting the latest updates for your neighbourhood.</p>
    </div>
  );
}
export function ErrorState({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="state-panel" role="alert">
      <h2>We couldn’t load the reports</h2>
      <p>{error.message}</p>
      <button className="button" onClick={retry}>
        Try again
      </button>
    </div>
  );
}
export function IssueCard({ issue, returnTo }: { issue: Issue; returnTo: string }) {
  return (
    <article className="issue-card">
      <div className="card-top">
        <CategoryIcon category={issue.category} />
        <StatusBadge status={issue.status} />
      </div>
      <p className="eyebrow card-category">{issue.category}</p>
      <h3>
        <Link to={`/issues/${issue.id}`} state={{ returnTo }}>
          {issue.title}
        </Link>
      </h3>
      <p className="location">
        <span aria-hidden="true">⌖</span> {issue.location}
      </p>
      <p className="card-description">{issue.description}</p>
      <div className="card-meta">
        <span className={`priority priority-${issue.severity.toLowerCase()}`}>
          {issue.severity} priority
        </span>
        <span>{issue.confirmations} confirmations</span>
      </div>
      <div className="card-footer">
        <time dateTime={issue.createdAt}>{dateLabel(issue.createdAt)}</time>
        <Link
          to={`/issues/${issue.id}`}
          state={{ returnTo }}
          aria-label={`View details: ${issue.title}`}
        >
          View report <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
