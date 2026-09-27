import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import { categories, severities, validateReport } from '../domain';
import type { Category, FormErrors, Issue, ReportInput, Severity } from '../domain';
import { issueKeys, useIssuesApi } from '../api/context';

const initial: ReportInput = {
  title: '',
  location: '',
  description: '',
  category: 'Water wastage',
  severity: 'Medium',
};
export function ReportIssue() {
  const [input, setInput] = useState(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const form = useRef<HTMLFormElement>(null);
  const api = useIssuesApi();
  const client = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (value: ReportInput) => api.create(value),
    onSuccess: (issue) => {
      client.setQueryData(issueKeys.detail(issue.id), issue);
      client.setQueryData<Issue[]>(issueKeys.all, (previous) =>
        previous ? [issue, ...previous.filter((item) => item.id !== issue.id)] : undefined,
      );
      void client.invalidateQueries({ queryKey: issueKeys.all });
      void navigate(`/issues/${issue.id}`, { replace: true, state: { created: true } });
    },
  });
  const update = <K extends keyof ReportInput>(key: K, value: ReportInput[K]) => {
    setInput((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      const next = { ...previous };
      delete next[key];
      return next;
    });
    if (mutation.isError) mutation.reset();
  };
  function submit(event: FormEvent) {
    event.preventDefault();
    if (mutation.isPending) return;
    const nextErrors = validateReport(input);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    mutation.mutate(input);
  }
  const fieldError = (field: keyof ReportInput) =>
    errors[field] ? (
      <span className="field-error" id={`${field}-error`}>
        {errors[field]}
      </span>
    ) : null;
  return (
    <div className="narrow-page">
      <Link className="back-link" to="/issues">
        ← Back to community reports
      </Link>
      <div className="page-heading">
        <p className="eyebrow">MAKE YOUR VOICE COUNT</p>
        <h1>Report an issue</h1>
        <p>A few details can be the first step towards a healthier neighbourhood.</p>
      </div>
      <div className="form-layout">
        <form ref={form} className="report-form panel" onSubmit={submit} noValidate>
          <p className="form-intro">All fields are required. Avoid sharing personal information.</p>
          {Object.keys(errors).some((key) => errors[key as keyof FormErrors]) && (
            <p role="alert" className="error-summary">
              Please check the highlighted fields.
            </p>
          )}
          {mutation.isError && (
            <div role="alert" className="error-summary">
              {mutation.error.message}
            </div>
          )}
          <fieldset disabled={mutation.isPending}>
            <label htmlFor="title">Issue title</label>
            <input
              id="title"
              name="title"
              required
              maxLength={100}
              value={input.title}
              onChange={(event) => update('title', event.target.value)}
              placeholder="e.g. Water leakage near Sector 15"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {fieldError('title')}
            <div className="form-row">
              <div>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={input.category}
                  onChange={(event) => update('category', event.target.value as Category)}
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={errors.category ? 'category-error' : undefined}
                >
                  {categories.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
                {fieldError('category')}
              </div>
              <div>
                <label htmlFor="severity">Priority</label>
                <select
                  id="severity"
                  name="severity"
                  value={input.severity}
                  onChange={(event) => update('severity', event.target.value as Severity)}
                  aria-invalid={Boolean(errors.severity)}
                  aria-describedby="severity-hint"
                >
                  {severities.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
                <small id="severity-hint">High: needs urgent local attention.</small>
                {fieldError('severity')}
              </div>
            </div>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              required
              maxLength={120}
              value={input.location}
              onChange={(event) => update('location', event.target.value)}
              placeholder="Area, street, and a nearby landmark"
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? 'location-error' : 'location-hint'}
            />
            <small id="location-hint">Use a public landmark rather than a private address.</small>
            {fieldError('location')}
            <label htmlFor="description">What did you notice?</label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              maxLength={2000}
              value={input.description}
              onChange={(event) => update('description', event.target.value)}
              placeholder="Describe the issue, how long it has been happening, and who it affects."
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? 'description-error description-hint' : 'description-hint'
              }
            />
            <small id="description-hint">
              At least 20 characters · {input.description.length}/2,000
            </small>
            {fieldError('description')}
            <div className="form-actions">
              <button className="button" type="submit">
                {mutation.isPending ? 'Submitting report…' : 'Submit report'}{' '}
                <span aria-hidden="true">↗</span>
              </button>
              <Link to="/issues" className="cancel-link">
                Cancel
              </Link>
            </div>
          </fieldset>
          {mutation.isPending && <p role="status">Saving your report. Please wait.</p>}
        </form>
        <aside className="report-tips">
          <span className="tips-icon" aria-hidden="true">
            ♧
          </span>
          <h2>A good report goes a long way.</h2>
          <ul>
            <li>Check the feed first. Someone may have already noticed the same issue.</li>
            <li>Be specific about the location and what needs attention.</li>
            <li>Keep descriptions factual and respectful.</li>
          </ul>
          <div className="demo-note">
            <strong>You’re in the demo</strong>
            <p>Your report stays in this browser. It won’t be sent to an authority.</p>
          </div>
          <p className="muted">Photos and map selection will arrive with the reporting backend.</p>
        </aside>
      </div>
    </div>
  );
}
