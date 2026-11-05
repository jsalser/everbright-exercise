import { useState } from 'react';

interface Props {
  onSubmit: (reason: string) => void;
  onCancel: () => void;
}

function ReasonModal({ onSubmit, onCancel }: Props) {
  const [reason, setReason] = useState('');

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reason for Moving Back</h2>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>
        <div className="modal-body">
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Why is this patient being moved back?"
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '8px',
              fontSize: '13px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button onClick={onCancel} style={{
              padding: '6px 14px', fontSize: '13px', borderRadius: '6px',
              border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer',
            }}>Cancel</button>
            <button
              onClick={() => reason.trim() && onSubmit(reason.trim())}
              disabled={!reason.trim()}
              style={{
                padding: '6px 14px', fontSize: '13px', borderRadius: '6px',
                border: 'none', background: reason.trim() ? '#3b82f6' : '#94a3b8',
                color: 'white', cursor: reason.trim() ? 'pointer' : 'not-allowed',
              }}
            >Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReasonModal;
