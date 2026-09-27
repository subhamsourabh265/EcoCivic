import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { createMockIssuesApi, IssuesApiContext, STORAGE_KEY } from '@ecocivic/issues-mfe';
import type { IssuesApi } from '@ecocivic/issues-mfe';
import { App } from '../src/App';

function mount(path = '/issues', api: IssuesApi = createMockIssuesApi({ delayMs: 0 })) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <IssuesApiContext value={api}>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </IssuesApiContext>
    </QueryClientProvider>,
  );
}

describe('community reporting journey', () => {
  beforeEach(() => localStorage.clear());

  it('creates a report, opens its timeline, finds it in the feed, and preserves it after remounting', async () => {
    const user = userEvent.setup();
    const view = mount('/issues/new');
    await user.type(screen.getByLabelText('Issue title'), 'Water pipe leaking beside the library');
    await user.selectOptions(screen.getByLabelText('Priority'), 'High');
    await user.type(screen.getByLabelText('Location'), 'Sector 15 library entrance');
    await user.type(
      screen.getByLabelText('What did you notice?'),
      'A broken pipe has been leaking across the public footpath for three days.',
    );
    await user.click(screen.getByRole('button', { name: /Submit report/ }));
    expect(await screen.findByText('Report submitted successfully.')).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Water pipe leaking beside the library' }),
    ).toBeTruthy();
    const timeline = screen.getByRole('region', { name: 'Following the progress' });
    expect(within(timeline).getAllByRole('listitem')).toHaveLength(4);
    expect(within(timeline).getByText('Reported').closest('li')?.getAttribute('aria-current')).toBe(
      'step',
    );
    await user.click(screen.getByRole('link', { name: /Back to community reports/ }));
    expect(
      await screen.findByRole('heading', { name: 'Water pipe leaking beside the library' }),
    ).toBeTruthy();
    view.unmount();
    mount('/issues?q=library');
    expect(
      await screen.findByRole('heading', { name: 'Water pipe leaking beside the library' }),
    ).toBeTruthy();
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });

  it('validates required fields and focuses the first invalid input', async () => {
    const user = userEvent.setup();
    mount('/issues/new');
    await user.click(screen.getByRole('button', { name: /Submit report/ }));
    expect(screen.getByRole('alert').textContent).toContain('highlighted fields');
    expect(document.activeElement).toBe(screen.getByLabelText('Issue title'));
    expect(screen.getByLabelText('Issue title').getAttribute('aria-invalid')).toBe('true');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('combines URL filters, preserves them after details, and recovers from an empty search', async () => {
    const user = userEvent.setup();
    mount('/issues?category=Water+wastage&severity=High&status=Reported');
    expect(
      await screen.findByRole('heading', { name: 'Water leakage near Sector 15' }),
    ).toBeTruthy();
    expect(screen.getAllByRole('article')).toHaveLength(1);
    await user.click(
      screen.getByRole('link', { name: 'View details: Water leakage near Sector 15' }),
    );
    expect(await screen.findByRole('heading', { name: 'About this issue' })).toBeTruthy();
    await user.click(screen.getByRole('link', { name: /Back to community reports/ }));
    await screen.findByRole('article');
    expect((screen.getByLabelText('Category') as HTMLSelectElement).value).toBe('Water wastage');
    await user.type(screen.getByRole('searchbox'), 'no-such-location');
    expect(screen.getByRole('heading', { name: 'No matching reports' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Clear all filters' }));
    expect(screen.getAllByRole('article')).toHaveLength(6);
  });

  it('shows loading, allows a failed query to be retried, and then renders reports', async () => {
    const user = userEvent.setup();
    const api = createMockIssuesApi({ delayMs: 0 });
    const list = vi
      .fn()
      .mockRejectedValueOnce(new Error('Temporary read failure'))
      .mockImplementation(() => api.list());
    mount('/issues', { ...api, list });
    expect(screen.getByRole('status').textContent).toContain('Loading');
    expect(await screen.findByRole('alert')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(
      await screen.findByRole('heading', { name: 'Water leakage near Sector 15' }),
    ).toBeTruthy();
    expect(list).toHaveBeenCalledTimes(2);
  });

  it('keeps form input when saving fails', async () => {
    const user = userEvent.setup();
    const api = createMockIssuesApi({ delayMs: 0 });
    mount('/issues/new', {
      ...api,
      create: vi.fn().mockRejectedValue(new Error('Storage is full. Please try again.')),
    });
    await user.type(screen.getByLabelText('Issue title'), 'Damaged public pavement');
    await user.type(screen.getByLabelText('Location'), 'Sector 10 school');
    await user.type(
      screen.getByLabelText('What did you notice?'),
      'Several paving stones are missing outside the school entrance.',
    );
    await user.click(screen.getByRole('button', { name: /Submit report/ }));
    expect((await screen.findByRole('alert')).textContent).toContain('Storage is full');
    expect((screen.getByLabelText('Issue title') as HTMLInputElement).value).toBe(
      'Damaged public pavement',
    );
    expect(
      (screen.getByRole('button', { name: /Submit report/ }) as HTMLButtonElement).disabled,
    ).toBe(false);
  });

  it('handles a missing report', async () => {
    mount('/issues/missing-id');
    expect(await screen.findByRole('heading', { name: 'Report not found' })).toBeTruthy();
  });

  it('handles unknown routes', () => {
    mount('/does-not-exist');
    expect(screen.getByRole('heading', { name: 'This page isn’t here' })).toBeTruthy();
  });

  it('handles a genuinely empty feed', async () => {
    localStorage.setItem(STORAGE_KEY, '[]');
    mount();
    expect(
      await screen.findByRole('heading', { name: 'Be the first to report an issue' }),
    ).toBeTruthy();
  });
});

describe('mock API storage boundary', () => {
  it('returns newest reports first on both initial seed and subsequent reads', async () => {
    const api = createMockIssuesApi({ delayMs: 0 });
    const seeded = await api.list();
    const restored = await api.list();
    expect(seeded.map((issue) => issue.id)).toEqual(restored.map((issue) => issue.id));
    const dates = seeded.map((issue) => Date.parse(issue.createdAt));
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it('does not silently overwrite malformed saved data', async () => {
    localStorage.setItem(STORAGE_KEY, '[{"title":"incomplete"}]');
    await expect(createMockIssuesApi({ delayMs: 0 }).list()).rejects.toThrow('could not be read');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[{"title":"incomplete"}]');
  });

  it('rejects whitespace-only reports before writing storage', async () => {
    await expect(
      createMockIssuesApi({ delayMs: 0 }).create({
        title: '         ',
        location: 'Park',
        description: '                    ',
        category: 'Water wastage',
        severity: 'Low',
      }),
    ).rejects.toThrow('Check the report details');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
