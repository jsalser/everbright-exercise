using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Everbright.Api.Domain.Events;

namespace Everbright.Api.Domain;

public enum PipelineStatus
{
    Backlog,
    Screening,
    Scheduled,
    StartedTreatment
}

public class PipelineItem
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Treatment { get; set; }
    public string? Insurance { get; set; }
    public string? Notes { get; set; }
    public PipelineStatus Status { get; set; } = PipelineStatus.Backlog;
    public int SortOrder { get; set; }
    public DateTime? EnteredBacklogAt { get; set; }
    public DateTime? LastMovedAt { get; set; }
    public string? MoveBackReason { get; set; }
    public bool IsDeclined { get; set; }
    public DateTime? DeclinedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public List<MoveHistory> History { get; set; } = [];

    [NotMapped, JsonIgnore]
    private readonly List<IDomainEvent> _domainEvents = [];

    [NotMapped, JsonIgnore]
    public IReadOnlyList<IDomainEvent> DomainEvents => _domainEvents;

    public void ClearDomainEvents() => _domainEvents.Clear();

    public void MoveTo(PipelineStatus target, int sortOrder, string? reason = null)
    {
        if (target == Status) return;

        var fromIdx = (int)Status;
        var toIdx = (int)target;

        if (toIdx > fromIdx + 1)
            throw new InvalidOperationException("Cannot skip stages. Move to the next stage first.");

        if (toIdx < fromIdx && string.IsNullOrWhiteSpace(reason))
            throw new InvalidOperationException("A reason is required when moving a patient backward.");

        var from = Status;
        Status = target;
        SortOrder = sortOrder;
        LastMovedAt = DateTime.UtcNow;
        MoveBackReason = toIdx < fromIdx ? reason : null;
        UpdatedAt = DateTime.UtcNow;

        _domainEvents.Add(new PatientMovedEvent(Id, from, target, reason, DateTime.UtcNow));
    }

    public void Decline(string reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
            throw new InvalidOperationException("A reason is required when removing a patient.");

        IsDeclined = true;
        DeclinedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;

        _domainEvents.Add(new PatientDeclinedEvent(Id, Status, reason, DateTime.UtcNow));
    }

    public void Restore()
    {
        IsDeclined = false;
        DeclinedAt = null;
        UpdatedAt = DateTime.UtcNow;

        _domainEvents.Add(new PatientRestoredEvent(Id, DateTime.UtcNow));
    }
}

public class MoveHistory
{
    public int Id { get; set; }
    public int PipelineItemId { get; set; }
    public PipelineStatus FromStatus { get; set; }
    public PipelineStatus ToStatus { get; set; }
    public string? Reason { get; set; }
    public DateTime MovedAt { get; set; } = DateTime.UtcNow;
}
