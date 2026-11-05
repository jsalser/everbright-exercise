import type { MoveHistoryEntry, PipelineItem, PipelineStatus } from './types';

const BASE = 'http://localhost:5128/api';

export async function fetchItems(): Promise<PipelineItem[]> {
  const res = await fetch(`${BASE}/items`);
  return res.json();
}

export async function moveItem(id: number, status: PipelineStatus, sortOrder: number, reason?: string): Promise<Response> {
  return fetch(`${BASE}/items/${id}/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, sortOrder, reason }),
  });
}

export async function fetchHistory(id: number): Promise<MoveHistoryEntry[]> {
  const res = await fetch(`${BASE}/items/${id}/history`);
  return res.json();
}

export async function declineItem(id: number, reason: string): Promise<PipelineItem> {
  const res = await fetch(`${BASE}/items/${id}/decline`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  return res.json();
}

export async function restoreItem(id: number): Promise<PipelineItem> {
  const res = await fetch(`${BASE}/items/${id}/restore`, { method: 'PATCH' });
  return res.json();
}
