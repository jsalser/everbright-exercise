using Everbright.Api.Data;
using Everbright.Api.Domain;
using Everbright.Api.Domain.Events;
using Microsoft.EntityFrameworkCore;

namespace Everbright.Api.Services;

public class PipelineService(AppDbContext db, DomainEventDispatcher dispatcher)
{
    public async Task<List<PipelineItem>> GetAllAsync()
    {
        return await db.PipelineItems.OrderBy(i => i.SortOrder).ToListAsync();
    }

    public async Task<PipelineItem?> MoveAsync(int id, PipelineStatus target, int sortOrder, string? reason)
    {
        var item = await db.PipelineItems.FindAsync(id);
        if (item is null) return null;

        item.MoveTo(target, sortOrder, reason);

        // NOTE: events are dispatched synchronously before SaveChanges so that
        // the history write and state change persist in the same transaction.
        // In production this would use an outbox or async event bus.
        dispatcher.Dispatch(item.DomainEvents, db);
        item.ClearDomainEvents();

        await db.SaveChangesAsync();
        return item;
    }

    public async Task<PipelineItem?> DeclineAsync(int id, string reason)
    {
        var item = await db.PipelineItems.FindAsync(id);
        if (item is null) return null;

        item.Decline(reason);

        dispatcher.Dispatch(item.DomainEvents, db);
        item.ClearDomainEvents();

        await db.SaveChangesAsync();
        return item;
    }

    public async Task<PipelineItem?> RestoreAsync(int id)
    {
        var item = await db.PipelineItems.FindAsync(id);
        if (item is null) return null;

        item.Restore();

        dispatcher.Dispatch(item.DomainEvents, db);
        item.ClearDomainEvents();

        await db.SaveChangesAsync();
        return item;
    }

    public async Task<List<MoveHistory>> GetHistoryAsync(int id)
    {
        return await db.MoveHistory
            .Where(h => h.PipelineItemId == id)
            .OrderByDescending(h => h.MovedAt)
            .ToListAsync();
    }
}
