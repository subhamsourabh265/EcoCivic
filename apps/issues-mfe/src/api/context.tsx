import { createContext, useContext } from 'react';
import { createMockIssuesApi } from './issues';
import type { IssuesApi } from './issues';

const defaultApi = createMockIssuesApi();
export const IssuesApiContext = createContext<IssuesApi>(defaultApi);
export const useIssuesApi = () => useContext(IssuesApiContext);
export const issueKeys = {
  all: ['issues'] as const,
  detail: (id: string) => ['issues', id] as const,
};
