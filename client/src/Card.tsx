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
  return Math.max(0, Math.floor((Date.now() - new Date(since).getTime()) / 3_600_000));
}

function Card({ item, currentStatus, onSelect }: Props) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id.toString());
  };

  const declined = item.isDeclined;
  const color = declined ? '#94a3b8' : STATUS_COLORS[currentStatus];
  const hours = getHoursInStatus(item);
  const canHighlight: PipelineStatus[] = ['Backlog', 'Screening'];
  const overdue = !declined && hours !== null && hours > 72 && canHighlight.includes(currentStatus);

  return (
    <div
      className="card"
      draggable={!declined}
      onDragStart={declined ? undefined : handleDragStart}
      onClick={() => onSelect(item)}
      style={{
        background: declined ? '#f1f5f9' : overdue ? 'rgb(255, 155, 155)' : 'white',
        border: `1px solid ${overdue ? '#ef4444' : '#94a3b8'}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: '6px',
        padding: '10px 12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        opacity: declined ? 0.5 : 1,
      }}
    >
      <span className="card-name">{item.name}</span>
      {hours !== null && !declined && (
        <div style={{ marginTop: '6px', fontSize: '11px', color: overdue ? '#dc2626' : '#64748b', textAlign: 'right' }}>
          {hours}h
        </div>
      )}
      {declined && (
        <div style={{ marginTop: '6px', fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>
          Declined
        </div>
      )}
    </div>
  );
}

export default Card;
