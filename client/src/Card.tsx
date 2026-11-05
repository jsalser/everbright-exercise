import type { PipelineItem, PipelineStatus } from './types';

interface Props {
  item: PipelineItem;
  currentStatus: PipelineStatus;
  onSelect: (item: PipelineItem) => void;
}

const STATUS_COLORS: Record<PipelineStatus, string> = {
  Backlog: '#f97316',
  Screening: '#f59e0b',
  Scheduled: '#3b82f6',
  StartedTreatment: '#10b981',
};

function Card({ item, currentStatus, onSelect }: Props) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id.toString());
  };

  const color = STATUS_COLORS[currentStatus];

  return (
    <div
      className="card"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect(item)}
      style={{
        background: 'white',
        border: '1px solid #94a3b8',
        borderLeft: `4px solid ${color}`,
        borderRadius: '6px',
        padding: '10px 12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <span className="card-name">{item.name}</span>
    </div>
  );
}

export default Card;
