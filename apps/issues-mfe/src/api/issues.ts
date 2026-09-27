import { categories, severities, statuses, validateReport } from '../domain';
import type { Issue, ReportInput } from '../domain';
import { createFixtures } from './fixtures';

export const STORAGE_KEY = 'ecocivic.demo.issues.v1';
export class IssueNotFoundError extends Error {}
export interface IssuesApi {
  list(): Promise<Issue[]>;
  get(id: string): Promise<Issue>;
  create(input: ReportInput): Promise<Issue>;
}

function isIssue(value: unknown): value is Issue {
  if (typeof value !== 'object' || value === null) return false;
  const issue = value as Record<string, unknown>;
  return (
    typeof issue.id === 'string' &&
    typeof issue.title === 'string' &&
    typeof issue.location === 'string' &&
    typeof issue.description === 'string' &&
    typeof issue.createdAt === 'string' &&
    Number.isFinite(Date.parse(issue.createdAt)) &&
    categories.some((category) => category === issue.category) &&
    severities.some((severity) => severity === issue.severity) &&
    statuses.some((status) => status === issue.status) &&
    typeof issue.confirmations === 'number' &&
    Number.isInteger(issue.confirmations) &&
    issue.confirmations >= 0 &&
    Array.isArray(issue.history) &&
    issue.history.every((entry: unknown) => {
      if (typeof entry !== 'object' || entry === null) return false;
      const event = entry as Record<string, unknown>;
      return (
        statuses.some((status) => status === event.status) &&
        typeof event.note === 'string' &&
        typeof event.at === 'string' &&
        Number.isFinite(Date.parse(event.at))
      );
    })
  );
}

// This asynchronous adapter is the only place that knows about browser storage.
// Replace it with HTTP calls when the backend is introduced.
export function createMockIssuesApi(
  options: { storage?: Storage; delayMs?: number } = {},
): IssuesApi {
  const delay = () => new Promise<void>((resolve) => setTimeout(resolve, options.delayMs ?? 300));
  const storage = () => options.storage ?? window.localStorage;
  function read(): Issue[] {
    try {
      const raw = storage().getItem(STORAGE_KEY);
      if (raw === null) {
        const fixtures = createFixtures();
        storage().setItem(STORAGE_KEY, JSON.stringify(fixtures));
        return fixtures.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      }
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.every(isIssue)) throw new Error('Invalid saved data');
      return parsed.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    } catch {
      throw new Error(
        'Your demo reports could not be read. Allow browser storage, or clear this site’s demo data if it is damaged, then try again.',
      );
    }
  }
  return {
    async list() {
      await delay();
      return read();
    },
    async get(id) {
      await delay();
      const issue = read().find((item) => item.id === id);
      if (!issue) throw new IssueNotFoundError('This report could not be found.');
      return issue;
    },
    async create(input) {
      await delay();
      if (Object.keys(validateReport(input)).length)
        throw new Error('Check the report details and try again.');
      const issues = read();
      const now = new Date().toISOString();
      const issue: Issue = {
        ...input,
        title: input.title.trim(),
        location: input.location.trim(),
        description: input.description.trim(),
        id: crypto.randomUUID(),
        createdAt: now,
        status: 'Reported',
        confirmations: 0,
        history: [
          { status: 'Reported', at: now, note: 'Your report was added to the community feed.' },
        ],
      };
      try {
        storage().setItem(STORAGE_KEY, JSON.stringify([issue, ...issues]));
      } catch {
        throw new Error(
          'Your report could not be saved. Browser storage may be full or unavailable. Your form has been kept so you can try again.',
        );
      }
      return issue;
    },
  };
}
