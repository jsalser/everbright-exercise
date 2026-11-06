using Everbright.Api.Data;
using Everbright.Api.Domain;
using Everbright.Api.Domain.Events;

namespace Everbright.Api.Services;

// NOTE: this is a synchronous, inline dispatcher — a demonstration of the pattern.
// In production, replace with MediatR, an outbox, or an async event bus.
public class DomainEventDispatcher
{
    public void Dispatch(IReadOnlyList<IDomainEvent> events, AppDbContext db)
    {
        foreach (var e in events)
        {
            switch (e)
            {
                case PatientMovedEvent moved:
                    db.MoveHistory.Add(new MoveHistory
                    {
                        PipelineItemId = moved.PatientId,
                        FromStatus = moved.From,
                        ToStatus = moved.To,
                        Reason = moved.Reason,
                        MovedAt = moved.OccurredAt,
                    });
                    break;

                case PatientDeclinedEvent declined:
                    db.MoveHistory.Add(new MoveHistory
                    {
                        PipelineItemId = declined.PatientId,
                        FromStatus = declined.StatusAtDecline,
                        ToStatus = declined.StatusAtDecline,
                        Reason = $"Removed: {declined.Reason}",
                        MovedAt = declined.OccurredAt,
                    });
                    break;

                case PatientRestoredEvent:
                    // no history entry for restores — could add if needed
                    break;
            }
        }
    }
}
