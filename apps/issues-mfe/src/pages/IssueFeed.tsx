import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router';
import { categories, severities, statuses } from '../domain';
import { issueKeys, useIssuesApi } from '../api/context';
import { ErrorState, IssueCard, LoadingState } from '../components/IssueElements';

export function IssueFeed() {
  const api = useIssuesApi();
  const query = useQuery({ queryKey: issueKeys.all, queryFn: () => api.list() });
  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';
  const category = categories.find((value) => value === params.get('category')) ?? '';
  const severity = severities.find((value) => value === params.get('severity')) ?? '';
  const status = statuses.find((value) => value === params.get('status')) ?? '';
  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const issues = query.data ?? [];
  const filtered = issues.filter(
    (issue) =>
      (!category || issue.category === category) &&
      (!severity || issue.severity === severity) &&
      (!status || issue.status === status) &&
      `${issue.title} ${issue.location} ${issue.description}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );
  const hasFilters = Boolean(search || category || severity || status);
  const returnTo = `/issues${params.size ? `?${params.toString()}` : ''}`;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">SMALL ACTIONS. SHARED PROGRESS.</p>
          <h1>
            A better neighbourhood
            <br />
            starts with us.
          </h1>
          <p>
            Spot an issue. Bring it to light. Follow the change.
            <br className="desktop-break" /> Your local knowledge can make a real difference.
          </p>
          <Link className="button button-light" to="/issues/new">
            <span aria-hidden="true">＋</span> Report an issue
          </Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-leaf leaf-one" />
          <div className="art-leaf leaf-two" />
          <div className="art-stem" />
          <span className="art-label">
            LOCAL ACTION
            <br />
            <strong>lasting change.</strong>
          </span>
        </div>
      </section>
      {query.isPending ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : (
        <>
          <section className="stats" aria-label="Demo community overview">
            <div>
              <span className="stat-icon" aria-hidden="true">
                ⌖
              </span>
              <div>
                <strong>{issues.length}</strong>
                <span>Community reports</span>
              </div>
            </div>
            <div>
              <span className="stat-icon" aria-hidden="true">
                ◷
              </span>
              <div>
                <strong>{issues.filter((issue) => issue.status !== 'Resolved').length}</strong>
                <span>Awaiting resolution</span>
              </div>
            </div>
            <div>
              <span className="stat-icon" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong>{issues.filter((issue) => issue.status === 'Resolved').length}</strong>
                <span>Issues resolved</span>
              </div>
            </div>
            <div>
              <span className="stat-icon" aria-hidden="true">
                ♧
              </span>
              <div>
                <strong>{issues.reduce((total, issue) => total + issue.confirmations, 0)}</strong>
                <span>Citizen confirmations</span>
              </div>
            </div>
          </section>
          <section aria-labelledby="feed-title" className="feed-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">ON YOUR RADAR</p>
                <h2 id="feed-title">Community reports</h2>
                <p>The things we notice today. The places we improve tomorrow.</p>
              </div>
              <span className="sort-label">
                Newest first <span aria-hidden="true">↓</span>
              </span>
            </div>
            <div className="filters">
              <label className="search-field">
                <span>Search reports</span>
                <input
                  type="search"
                  placeholder="Search issues or locations…"
                  value={search}
                  onChange={(event) => setFilter('q', event.target.value)}
                />
              </label>
              <label>
                <span>Category</span>
                <select
                  value={category}
                  onChange={(event) => setFilter('category', event.target.value)}
                >
                  <option value="">All categories</option>
                  {categories.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Priority</span>
                <select
                  value={severity}
                  onChange={(event) => setFilter('severity', event.target.value)}
                >
                  <option value="">All priorities</option>
                  {severities.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Status</span>
                <select
                  value={status}
                  onChange={(event) => setFilter('status', event.target.value)}
                >
                  <option value="">All statuses</option>
                  {statuses.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="results-line">
              <span role="status">
                {filtered.length} {filtered.length === 1 ? 'report' : 'reports'}
                {hasFilters ? ' matching your filters' : ' in your community'}
              </span>
              {hasFilters && (
                <button className="text-button" onClick={() => setParams({})}>
                  Clear filters
                </button>
              )}
            </div>
            {filtered.length ? (
              <div className="issue-grid">
                {filtered.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} returnTo={returnTo} />
                ))}
              </div>
            ) : (
              <div className="state-panel">
                <h3>{hasFilters ? 'No matching reports' : 'Be the first to report an issue'}</h3>
                <p>
                  {hasFilters
                    ? 'Try another search or clear your filters to see the community feed.'
                    : 'Share something that needs attention in your neighbourhood.'}
                </p>
                {hasFilters ? (
                  <button className="button button-secondary" onClick={() => setParams({})}>
                    Clear all filters
                  </button>
                ) : (
                  <Link className="button" to="/issues/new">
                    Report an issue
                  </Link>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
