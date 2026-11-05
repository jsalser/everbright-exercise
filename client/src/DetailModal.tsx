import { useEffect, useState } from 'react';
import { STATUSES } from './types';
import type { MoveHistoryEntry, PipelineItem } from './types';
import { fetchHistory, declineItem, restoreItem } from './api';

interface Props {
  item: PipelineItem;
  onClose: () => void;
  onUpdate: () => void;
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

function statusLabel(key: string): string {
  return STATUSES.find(s => s.key === key)?.label ?? key;
}

function DetailModal({ item, onClose, onUpdate }: Props) {
  const [history, setHistory] = useState<MoveHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [removeReason, setRemoveReason] = useState('');

  useEffect(() => {
    if (showHistory) fetchHistory(item.id).then(setHistory);
  }, [showHistory, item.id]);

  const handleRemove = async () => {
    if (!removeReason.trim()) return;
    await declineItem(item.id, removeReason.trim());
    onUpdate();
    onClose();
  };

  const handleRestore = async () => {
    await restoreItem(item.id);
    onUpdate();
    onClose();
  };

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
            <span>{statusLabel(item.status)}{item.isDeclined ? ' (Declined)' : ''}</span>
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

          <div
            onClick={() => setShowHistory(!showHistory)}
            style={{
              marginTop: '12px', cursor: 'pointer', fontSize: '13px',
              color: '#3b82f6', fontWeight: 500, userSelect: 'none',
            }}
          >
            {showHistory ? '− Hide History' : '+ Show History'}
          </div>
          {showHistory && (
            <div style={{ marginTop: '8px' }}>
              {history.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#94a3b8', padding: '4px 0' }}>No moves recorded</div>
              ) : (
                history.map(h => (
                  <div key={h.id} style={{
                    fontSize: '12px', padding: '6px 0',
                    borderBottom: '1px solid #f1f5f9', color: '#475569',
                  }}>
                    <div>{statusLabel(h.fromStatus)} → {statusLabel(h.toStatus)}</div>
                    <div style={{ color: '#94a3b8', marginTop: '2px' }}>{formatDateTime(h.movedAt)}</div>
                    {h.reason && <div style={{ color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>"{h.reason}"</div>}
                  </div>
                ))
              )}
            </div>
          )}

          <div style={{ marginTop: '16px' }}>
            {item.isDeclined ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleRestore} style={{
                  padding: '6px 14px', fontSize: '13px', borderRadius: '6px',
                  border: '1px solid #3b82f6', background: 'white', color: '#3b82f6',
                  cursor: 'pointer', fontWeight: 500,
                }}>Restore</button>
              </div>
            ) : showRemove ? (
              <>
                <textarea
                  value={removeReason}
                  onChange={e => setRemoveReason(e.target.value)}
                  placeholder="Reason for removing this patient..."
                  autoFocus
                  style={{
                    width: '100%', minHeight: '60px', padding: '8px',
                    fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '6px',
                    resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                  <button onClick={() => { setShowRemove(false); setRemoveReason(''); }} style={{
                    padding: '6px 14px', fontSize: '13px', borderRadius: '6px',
                    border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer',
                  }}>Cancel</button>
                  <button onClick={handleRemove} disabled={!removeReason.trim()} style={{
                    padding: '6px 14px', fontSize: '13px', borderRadius: '6px',
                    border: 'none', background: removeReason.trim() ? '#ef4444' : '#94a3b8',
                    color: 'white', cursor: removeReason.trim() ? 'pointer' : 'not-allowed',
                    fontWeight: 500,
                  }}>Confirm</button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowRemove(true)} style={{
                  padding: '6px 14px', fontSize: '13px', borderRadius: '6px',
                  border: '1px solid #ef4444', background: 'white', color: '#ef4444',
                  cursor: 'pointer', fontWeight: 500,
                }}>Remove</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
