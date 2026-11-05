export type PipelineStatus = 'Backlog' | 'Screening' | 'Scheduled' | 'StartedTreatment';

export interface PipelineItem {
  id: number;
  name: string;
  status: PipelineStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const STATUSES: { key: PipelineStatus; label: string }[] = [
  { key: 'Backlog', label: 'Backlog' },
  { key: 'Screening', label: 'Screening' },
  { key: 'Scheduled', label: 'Scheduled' },
  { key: 'StartedTreatment', label: 'Started Treatment' },
];

const STATUS_ORDER: Record<PipelineStatus, number> = {
  Backlog: 0,
  Screening: 1,
  Scheduled: 2,
  StartedTreatment: 3,
};

export function canMove(from: PipelineStatus, to: PipelineStatus): boolean {
  return STATUS_ORDER[to] <= STATUS_ORDER[from] + 1;
}
