using Everbright.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Everbright.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<PipelineItem> PipelineItems => Set<PipelineItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PipelineItem>()
            .Property(p => p.Status)
            .HasConversion<string>();

        var now = DateTime.UtcNow;

        modelBuilder.Entity<PipelineItem>().HasData(
            new { Id = 1, Name = "Maria Santos", Treatment = "TMS", Insurance = "Aetna Gold", Notes = "Patient is a 42 year old woman", Status = PipelineStatus.Backlog, SortOrder = 0, EnteredBacklogAt = now.AddHours(-85), LastMovedAt = (DateTime?)null, CreatedAt = now, UpdatedAt = now },
            new { Id = 2, Name = "James O'Brien", Treatment = "Spravato", Insurance = "BCBSTX", Notes = "Patient is a 55 year old man", Status = PipelineStatus.Backlog, SortOrder = 1, EnteredBacklogAt = now.AddHours(-36), LastMovedAt = (DateTime?)null, CreatedAt = now, UpdatedAt = now },
            new { Id = 3, Name = "Priya Patel", Treatment = "TMS", Insurance = "Aetna Gold", Notes = "Patient is a 31 year old woman", Status = PipelineStatus.Screening, SortOrder = 0, EnteredBacklogAt = now.AddDays(-10), LastMovedAt = now.AddHours(-92), CreatedAt = now, UpdatedAt = now },
            new { Id = 4, Name = "David Kim", Treatment = "Spravato", Insurance = "BCBSTX", Notes = "Patient is a 47 year old man", Status = PipelineStatus.Screening, SortOrder = 1, EnteredBacklogAt = now.AddDays(-8), LastMovedAt = now.AddHours(-18), CreatedAt = now, UpdatedAt = now },
            new { Id = 5, Name = "Sarah Mitchell", Treatment = "TMS", Insurance = "Aetna Gold", Notes = "Patient is a 29 year old woman", Status = PipelineStatus.Scheduled, SortOrder = 0, EnteredBacklogAt = now.AddDays(-14), LastMovedAt = now.AddDays(-2), CreatedAt = now, UpdatedAt = now },
            new { Id = 6, Name = "Robert Johnson", Treatment = "Spravato", Insurance = "BCBSTX", Notes = "Patient is a 63 year old man", Status = PipelineStatus.Scheduled, SortOrder = 1, EnteredBacklogAt = now.AddDays(-12), LastMovedAt = now.AddDays(-4), CreatedAt = now, UpdatedAt = now },
            new { Id = 7, Name = "Lin Wei", Treatment = "TMS", Insurance = "Aetna Gold", Notes = "Patient is a 38 year old woman", Status = PipelineStatus.StartedTreatment, SortOrder = 0, EnteredBacklogAt = now.AddDays(-21), LastMovedAt = now.AddDays(-1), CreatedAt = now, UpdatedAt = now },
            new { Id = 8, Name = "Angela Torres", Treatment = "Spravato", Insurance = "BCBSTX", Notes = "Patient is a 51 year old woman", Status = PipelineStatus.StartedTreatment, SortOrder = 1, EnteredBacklogAt = now.AddDays(-18), LastMovedAt = now.AddDays(-6), CreatedAt = now, UpdatedAt = now }
        );
    }
}
