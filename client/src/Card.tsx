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

export function getHoursInStatus(item: PipelineItem): number | null {
  const since = item.status === 'Backlog' ? item.enteredBacklogAt : item.lastMovedAt;
  if (!since) return null;
  return Math.floor((Date.now() - new Date(since).getTime()) / 3_600_000);
}

function Card({ item, currentStatus, onSelect }: Props) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id.toString());
  };

  const color = STATUS_COLORS[currentStatus];
  const hours = getHoursInStatus(item);
  const canHighlight: PipelineStatus[] = ['Backlog', 'Screening'];
  const overdue = hours !== null && hours > 72 && canHighlight.includes(currentStatus);

  return (
    <div
      className="card"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect(item)}
      style={{
        background: overdue ? 'rgb(255, 155, 155)' : 'white',
        border: `1px solid ${overdue ? '#ef4444' : '#94a3b8'}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: '6px',
        padding: '10px 12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <span className="card-name">{item.name}</span>
      {hours !== null && (
        <div style={{ marginTop: '6px', fontSize: '11px', color: overdue ? '#dc2626' : '#64748b', textAlign: 'right' }}>
          {hours}h
        </div>
      )}
    </div>
  );
}

export default Card;
