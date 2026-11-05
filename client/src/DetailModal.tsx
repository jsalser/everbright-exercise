import { STATUSES } from './types';
import type { PipelineItem } from './types';

interface Props {
  item: PipelineItem;
  onClose: () => void;
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function DetailModal({ item, onClose }: Props) {
  const statusLabel = STATUSES.find(s => s.key === item.status)?.label ?? item.status;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item.name}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="modal-row">
            <span className="modal-label">Status</span>
            <span>{statusLabel}</span>
          </div>
          {item.treatment && (
            <div className="modal-row">
              <span className="modal-label">Treatment</span>
              <span>{item.treatment}</span>
            </div>
          )}
          {item.insurance && (
            <div className="modal-row">
              <span className="modal-label">Insurance</span>
              <span>{item.insurance}</span>
            </div>
          )}
          {item.notes && (
            <div className="modal-row">
              <span className="modal-label">Notes</span>
              <span>{item.notes}</span>
            </div>
          )}
          <div className="modal-row">
            <span className="modal-label">Entered Backlog</span>
            <span>{formatDate(item.enteredBacklogAt)}</span>
          </div>
          <div className="modal-row">
            <span className="modal-label">Last Moved</span>
            <span>{item.lastMovedAt ? formatDate(item.lastMovedAt) : 'Not yet moved'}</span>
          </div>
          {item.moveBackReason && (
            <div className="modal-row">
              <span className="modal-label">Move Back Reason</span>
              <span>{item.moveBackReason}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
