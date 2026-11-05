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

        modelBuilder.Entity<PipelineItem>().HasData(
            new { Id = 1, Name = "Maria Santos", Status = PipelineStatus.Backlog, SortOrder = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new { Id = 2, Name = "James O'Brien", Status = PipelineStatus.Backlog, SortOrder = 1, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new { Id = 3, Name = "Priya Patel", Status = PipelineStatus.Screening, SortOrder = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new { Id = 4, Name = "David Kim", Status = PipelineStatus.Screening, SortOrder = 1, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new { Id = 5, Name = "Sarah Mitchell", Status = PipelineStatus.Scheduled, SortOrder = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new { Id = 6, Name = "Robert Johnson", Status = PipelineStatus.Scheduled, SortOrder = 1, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new { Id = 7, Name = "Lin Wei", Status = PipelineStatus.StartedTreatment, SortOrder = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new { Id = 8, Name = "Angela Torres", Status = PipelineStatus.StartedTreatment, SortOrder = 1, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
        );
    }
}
