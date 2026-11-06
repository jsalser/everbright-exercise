namespace Everbright.Api.Domain.Events;

public interface IDomainEvent
{
    DateTime OccurredAt { get; }
}

public record PatientMovedEvent(
    int PatientId,
    PipelineStatus From,
    PipelineStatus To,
    string? Reason,
    DateTime OccurredAt
) : IDomainEvent;

public record PatientDeclinedEvent(
    int PatientId,
    PipelineStatus StatusAtDecline,
    string Reason,
    DateTime OccurredAt
) : IDomainEvent;

public record PatientRestoredEvent(
    int PatientId,
    DateTime OccurredAt
) : IDomainEvent;
