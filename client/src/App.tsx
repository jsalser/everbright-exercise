import { useEffect, useState } from 'react';
import { canMove, isBackwardMove, STATUSES } from './types';
import type { FilterMode, PipelineItem, PipelineStatus } from './types';
import { fetchItems, moveItem } from './api';
import Column from './Column';
import DetailModal from './DetailModal';
import ReasonModal from './ReasonModal';
import { getHoursInStatus } from './Card';
import './App.css';

const FILTERS: { key: FilterMode; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'declined', label: 'Declined' },
];

function App() {
  const [items, setItems] = useState<PipelineItem[]>([]);
  const [selected, setSelected] = useState<PipelineItem | null>(null);
  const [pendingMove, setPendingMove] = useState<{ id: number; status: PipelineStatus } | null>(null);
  const [filter, setFilter] = useState<FilterMode>('active');

  const load = () => fetchItems().then(setItems);

  useEffect(() => { load(); }, []);

  const handleMove = async (id: number, status: PipelineStatus, reason?: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (item.status === status) return;
    if (!canMove(item.status, status)) {
      const fromLabel = STATUSES.find(s => s.key === item.status)?.label;
      const toLabel = STATUSES.find(s => s.key === status)?.label;
      alert(`Cannot skip stages: ${fromLabel} → ${toLabel}`);
      return;
    }
    if (isBackwardMove(item.status, status) && !reason) {
      setPendingMove({ id, status });
      return;
    }
    const columnItems = items.filter(i => i.status === status);
    await moveItem(id, status, columnItems.length, reason);
    load();
  };

  const filtered = items.filter(i => {
    if (filter === 'active') return !i.isDeclined;
    if (filter === 'declined') return i.isDeclined;
    return true;
  });

  const grouped = STATUSES.map(s => ({
    ...s,
    items: filtered
      .filter(i => i.status === s.key)
      .sort((a, b) => {
        if (a.isDeclined !== b.isDeclined) return a.isDeclined ? 1 : -1;
        return (getHoursInStatus(b) ?? 0) - (getHoursInStatus(a) ?? 0);
      }),
  }));

  return (
    <div className="app">
      <header className="header">
        <h1>Everbright Pipeline</h1>
        <div className="filter-toggle">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? 'filter-active' : ''}`}
              onClick={() => setFilter(f.key)}
            >{f.label}</button>
          ))}
        </div>
      </header>
      <div className="board">
        {grouped.map(col => (
          <Column
            key={col.key}
            status={col.key}
            label={col.label}
            items={col.items}
            onMove={handleMove}
            onSelect={setSelected}
          />
        ))}
      </div>
      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} onUpdate={load} />
      )}
      {pendingMove && (
        <ReasonModal
          onSubmit={(reason) => {
            handleMove(pendingMove.id, pendingMove.status, reason);
            setPendingMove(null);
          }}
          onCancel={() => setPendingMove(null)}
        />
      )}
    </div>
  );
}

export default App;
