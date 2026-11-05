import type { PipelineItem, PipelineStatus } from './types';

const BASE = 'http://localhost:5128/api';

export async function fetchItems(): Promise<PipelineItem[]> {
  const res = await fetch(`${BASE}/items`);
  return res.json();
}

export async function moveItem(id: number, status: PipelineStatus, sortOrder: number): Promise<PipelineItem> {
  const res = await fetch(`${BASE}/items/${id}/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, sortOrder }),
  });
  return res.json();
}

export async function deleteItem(id: number): Promise<void> {
  await fetch(`${BASE}/items/${id}`, { method: 'DELETE' });
}
