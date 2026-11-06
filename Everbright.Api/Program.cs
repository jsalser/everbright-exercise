using System.Text.Json.Serialization;
using Everbright.Api.Data;
using Everbright.Api.Domain;
using Everbright.Api.Services;
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

builder.Services.AddScoped<PipelineService>();
builder.Services.AddSingleton<DomainEventDispatcher>();

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

app.MapGet("/api/items", async (PipelineService svc) =>
    await svc.GetAllAsync());

// TODO: add input validation (FluentValidation or data annotations)
app.MapPost("/api/items", async (PipelineItem item, AppDbContext db) =>
{
    item.CreatedAt = DateTime.UtcNow;
    item.UpdatedAt = DateTime.UtcNow;
    db.PipelineItems.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/api/items/{item.Id}", item);
});

// TODO: add optimistic concurrency (ETag/row version) to prevent race conditions
app.MapPatch("/api/items/{id}/move", async (int id, MoveRequest move, PipelineService svc) =>
{
    try
    {
        var item = await svc.MoveAsync(id, move.Status, move.SortOrder, move.Reason);
        return item is null ? Results.NotFound() : Results.Ok(item);
    }
    catch (InvalidOperationException ex)
    {
        return Results.BadRequest(ex.Message);
    }
});

app.MapGet("/api/items/{id}/history", async (int id, PipelineService svc) =>
{
    var history = await svc.GetHistoryAsync(id);
    return Results.Ok(history);
});

app.MapPatch("/api/items/{id}/decline", async (int id, DeclineRequest req, PipelineService svc) =>
{
    try
    {
        var item = await svc.DeclineAsync(id, req.Reason ?? "");
        return item is null ? Results.NotFound() : Results.Ok(item);
    }
    catch (InvalidOperationException ex)
    {
        return Results.BadRequest(ex.Message);
    }
});

app.MapPatch("/api/items/{id}/restore", async (int id, PipelineService svc) =>
{
    var item = await svc.RestoreAsync(id);
    return item is null ? Results.NotFound() : Results.Ok(item);
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
