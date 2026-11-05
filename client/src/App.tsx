import { useEffect, useState } from 'react';
import { canMove, STATUSES } from './types';
import type { PipelineItem, PipelineStatus } from './types';
import { fetchItems, moveItem } from './api';
import Column from './Column';
import './App.css';

function App() {
  const [items, setItems] = useState<PipelineItem[]>([]);

  const load = () => fetchItems().then(setItems);

  useEffect(() => { load(); }, []);

  const handleMove = async (id: number, status: PipelineStatus) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (item.status === status) return;
    if (!canMove(item.status, status)) {
      const fromLabel = STATUSES.find(s => s.key === item.status)?.label;
      const toLabel = STATUSES.find(s => s.key === status)?.label;
      alert(`Cannot skip stages: ${fromLabel} → ${toLabel}`);
      return;
    }
    const columnItems = items.filter(i => i.status === status);
    await moveItem(id, status, columnItems.length);
    load();
  };

  const grouped = STATUSES.map(s => ({
    ...s,
    items: items.filter(i => i.status === s.key).sort((a, b) => a.sortOrder - b.sortOrder),
  }));

  return (
    <div className="app">
      <header className="header">
        <h1>Everbright Pipeline</h1>
      </header>
      <div className="board">
        {grouped.map(col => (
          <Column
            key={col.key}
            status={col.key}
            label={col.label}
            items={col.items}
            onMove={handleMove}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
