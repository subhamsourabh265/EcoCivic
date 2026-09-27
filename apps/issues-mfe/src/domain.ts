export const categories = [
  'Water wastage',
  'Waste & dumping',
  'Air pollution',
  'Public infrastructure',
  'Trees & greenery',
  'Sewage',
  'Plastic waste',
] as const;
export const severities = ['Low', 'Medium', 'High'] as const;
export const statuses = ['Reported', 'Verified', 'In progress', 'Resolved'] as const;
export type Category = (typeof categories)[number];
export type Severity = (typeof severities)[number];
export type Status = (typeof statuses)[number];
export interface ReportInput {
  title: string;
  category: Category;
  severity: Severity;
  location: string;
  description: string;
}
export interface Issue extends ReportInput {
  id: string;
  createdAt: string;
  status: Status;
  confirmations: number;
  history: { status: Status; at: string; note: string }[];
}
export type FormErrors = Partial<Record<keyof ReportInput, string>>;
export function validateReport(input: ReportInput): FormErrors {
  const errors: FormErrors = {};
  if (input.title.trim().length < 8 || input.title.trim().length > 100)
    errors.title = 'Use between 8 and 100 characters for the title.';
  if (input.location.trim().length < 3 || input.location.trim().length > 120)
    errors.location = 'Enter a location between 3 and 120 characters.';
  if (input.description.trim().length < 20 || input.description.trim().length > 2000)
    errors.description = 'Describe the issue in 20 to 2,000 characters.';
  if (!categories.includes(input.category)) errors.category = 'Choose a category.';
  if (!severities.includes(input.severity)) errors.severity = 'Choose a priority.';
  return errors;
}
