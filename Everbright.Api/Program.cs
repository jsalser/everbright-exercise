using System.Text.Json.Serialization;
using Everbright.Api.Data;
using Everbright.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// TODO: move connection string to appsettings.json / environment variables
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=everbright.db"));

// TODO: CORS policy is too permissive — restrict headers/methods, add credential policy,
// and configure allowed origins from environment for production
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // TODO: replace with EF Core migrations for production — EnsureCreated can't update existing schemas
    db.Database.EnsureCreated();
}

app.UseCors();

// TODO: add global exception handler middleware returning RFC 7807 problem details
// TODO: add authentication/authorization — all endpoints are currently anonymous
// TODO: add structured logging for moves, declines, and errors

// TODO: endpoint handlers contain inline business logic — extract to a domain service layer
// with explicit transaction boundaries and rollback handling

app.MapGet("/api/items", async (AppDbContext db) =>
    await db.PipelineItems.OrderBy(i => i.SortOrder).ToListAsync());

// TODO: add input validation (FluentValidation or data annotations) — no model validation on any endpoint
app.MapPost("/api/items", async (PipelineItem item, AppDbContext db) =>
{
    item.CreatedAt = DateTime.UtcNow;
    item.UpdatedAt = DateTime.UtcNow;
    db.PipelineItems.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/api/items/{item.Id}", item);
});

// TODO: add optimistic concurrency (ETag/row version) to prevent race conditions on concurrent moves
app.MapPatch("/api/items/{id}/move", async (int id, MoveRequest move, AppDbContext db) =>
{
    var item = await db.PipelineItems.FindAsync(id);
    if (item is null) return Results.NotFound();

    var fromIdx = (int)item.Status;
    var toIdx = (int)move.Status;
    if (toIdx > fromIdx + 1)
        return Results.BadRequest("Cannot skip stages. Move to the next stage first.");
    if (toIdx < fromIdx && string.IsNullOrWhiteSpace(move.Reason))
        return Results.BadRequest("A reason is required when moving a patient backward.");

    db.MoveHistory.Add(new MoveHistory
    {
        PipelineItemId = item.Id,
        FromStatus = item.Status,
        ToStatus = move.Status,
        Reason = move.Reason,
        MovedAt = DateTime.UtcNow,
    });

    item.Status = move.Status;
    item.SortOrder = move.SortOrder;
    item.LastMovedAt = DateTime.UtcNow;
    item.MoveBackReason = toIdx < fromIdx ? move.Reason : null;
    item.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(item);
});

app.MapGet("/api/items/{id}/history", async (int id, AppDbContext db) =>
{
    var item = await db.PipelineItems.FindAsync(id);
    if (item is null) return Results.NotFound();
    var history = await db.MoveHistory
        .Where(h => h.PipelineItemId == id)
        .OrderByDescending(h => h.MovedAt)
        .ToListAsync();
    return Results.Ok(history);
});

app.MapPatch("/api/items/{id}/decline", async (int id, DeclineRequest req, AppDbContext db) =>
{
    var item = await db.PipelineItems.FindAsync(id);
    if (item is null) return Results.NotFound();
    if (string.IsNullOrWhiteSpace(req.Reason))
        return Results.BadRequest("A reason is required when removing a patient.");

    db.MoveHistory.Add(new MoveHistory
    {
        PipelineItemId = item.Id,
        FromStatus = item.Status,
        ToStatus = item.Status,
        Reason = $"Removed: {req.Reason}",
        MovedAt = DateTime.UtcNow,
    });

    item.IsDeclined = true;
    item.DeclinedAt = DateTime.UtcNow;
    item.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(item);
});

app.MapPatch("/api/items/{id}/restore", async (int id, AppDbContext db) =>
{
    var item = await db.PipelineItems.FindAsync(id);
    if (item is null) return Results.NotFound();

    item.IsDeclined = false;
    item.DeclinedAt = null;
    item.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(item);
});

// TODO: hard delete contradicts "declined but tracked" — consider removing or restricting to admin
app.MapDelete("/api/items/{id}", async (int id, AppDbContext db) =>
{
    var item = await db.PipelineItems.FindAsync(id);
    if (item is null) return Results.NotFound();

    db.PipelineItems.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

record MoveRequest(PipelineStatus Status, int SortOrder, string? Reason = null);
record DeclineRequest(string? Reason = null);
