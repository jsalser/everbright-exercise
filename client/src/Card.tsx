import type { PipelineItem, PipelineStatus } from './types';

interface Props {
  item: PipelineItem;
  currentStatus: PipelineStatus;
}

const STATUS_COLORS: Record<PipelineStatus, string> = {
  Backlog: '#f97316',
  Screening: '#f59e0b',
  Scheduled: '#3b82f6',
  StartedTreatment: '#10b981',
};

function Card({ item, currentStatus }: Props) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id.toString());
  };

  const color = STATUS_COLORS[currentStatus];

  return (
    <div
      className="card"
      draggable
      onDragStart={handleDragStart}
      style={{ borderLeftColor: color } as React.CSSProperties}
    >
      <span className="card-name">{item.name}</span>
    </div>
  );
}

export default Card;
