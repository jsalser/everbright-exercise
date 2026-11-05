namespace Everbright.Api.Models;

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

    public List<MoveHistory> History { get; set; } = [];
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
