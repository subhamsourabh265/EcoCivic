import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'react-router';
import { issueKeys, useIssuesApi } from '../api/context';
import { IssueNotFoundError } from '../api/issues';
import {
  CategoryIcon,
  dateLabel,
  ErrorState,
  LoadingState,
  StatusBadge,
} from '../components/IssueElements';
import { statuses } from '../domain';

export function IssueDetails() {
  const { issueId = '' } = useParams();
  const location = useLocation();
  const state = location.state as { created?: boolean; returnTo?: string } | null;
  const returnTo = state?.returnTo?.startsWith('/issues?') ? state.returnTo : '/issues';
  const api = useIssuesApi();
  const query = useQuery({ queryKey: issueKeys.detail(issueId), queryFn: () => api.get(issueId) });
  if (query.isPending) return <LoadingState />;
  if (query.isError)
    return query.error instanceof IssueNotFoundError ? (
      <div className="state-panel">
        <h1>Report not found</h1>
        <p>This report may no longer be saved in this browser.</p>
        <Link className="button" to="/issues">
          Back to reports
        </Link>
      </div>
    ) : (
      <ErrorState error={query.error} retry={() => void query.refetch()} />
    );
  const issue = query.data;
  return (
    <div className="narrow-page">
      <Link className="back-link" to={returnTo}>
        ← Back to community reports
      </Link>
      {state?.created && (
        <div className="success-banner" role="status">
          <strong>Report submitted successfully.</strong> Your issue is now in the community feed.
        </div>
      )}
      <div className="detail-heading">
        <CategoryIcon category={issue.category} />
        <div>
          <p className="eyebrow">{issue.category}</p>
          <h1>{issue.title}</h1>
          <p className="location">⌖ {issue.location}</p>
        </div>
      </div>
      <div className="detail-layout">
        <section className="panel detail-body">
          <div className="detail-badges">
            <StatusBadge status={issue.status} />
            <span className={`priority priority-${issue.severity.toLowerCase()}`}>
              {issue.severity} priority
            </span>
          </div>
          <h2>About this issue</h2>
          <p className="description-full">{issue.description}</p>
          <dl className="detail-facts">
            <div>
              <dt>Reported</dt>
              <dd>
                <time dateTime={issue.createdAt}>{dateLabel(issue.createdAt)}</time>
              </dd>
            </div>
            <div>
              <dt>Citizen confirmations</dt>
              <dd>{issue.confirmations}</dd>
            </div>
          </dl>
          <p className="demo-note">
            Demo report · Confirmations and authority actions will be available in a later phase.
          </p>
        </section>
        <section className="panel timeline-panel" aria-labelledby="timeline-title">
          <h2 id="timeline-title">Following the progress</h2>
          <p className="muted">Every step towards a resolution.</p>
          <ol className="timeline">
            {statuses.map((status) => {
              const event = issue.history.find((item) => item.status === status);
              return (
                <li
                  key={status}
                  className={event ? 'complete' : ''}
                  aria-current={issue.status === status ? 'step' : undefined}
                >
                  <span className="timeline-dot" aria-hidden="true">
                    {event ? '✓' : '·'}
                  </span>
                  <div>
                    <h3>{status}</h3>
                    {event ? (
                      <>
                        <time dateTime={event.at}>{dateLabel(event.at)}</time>
                        <p>{event.note}</p>
                      </>
                    ) : (
                      <p>Awaiting this step</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
