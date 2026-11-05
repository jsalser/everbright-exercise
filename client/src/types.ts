export type PipelineStatus = 'Backlog' | 'Screening' | 'Scheduled' | 'StartedTreatment';

export interface PipelineItem {
  id: number;
  name: string;
  treatment?: string;
  insurance?: string;
  notes?: string;
  status: PipelineStatus;
  sortOrder: number;
  enteredBacklogAt?: string;
  lastMovedAt?: string;
  moveBackReason?: string;
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
  const diff = STATUS_ORDER[to] - STATUS_ORDER[from];
  return diff === 1 || diff < 0;
}

export function isBackwardMove(from: PipelineStatus, to: PipelineStatus): boolean {
  return STATUS_ORDER[to] < STATUS_ORDER[from];
}
