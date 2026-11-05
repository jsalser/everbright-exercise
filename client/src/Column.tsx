import type { PipelineItem, PipelineStatus } from './types';
import Card from './Card';

interface Props {
  status: PipelineStatus;
  label: string;
  items: PipelineItem[];
  onMove: (id: number, status: PipelineStatus) => void;
  onSelect: (item: PipelineItem) => void;
}

function Column({ status, label, items, onMove, onSelect }: Props) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    if (!isNaN(id)) onMove(id, status);
  };

  const accentClass = `column-accent-${status.toLowerCase()}`;

  return (
    <div
      className={`column ${accentClass}`}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <h2>{label}</h2>
        <span className="count">{items.length}</span>
      </div>
      <div className="cards">
        {items.map(item => (
          <Card key={item.id} item={item} currentStatus={status} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

export default Column;
