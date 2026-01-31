using Carter;
using WebAPI.Infrastructure.Database;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddCarter();

builder.Services.AddDbContext<AppDbContext>();

builder.Services.AddCors(cfg =>
{
    cfg.AddDefaultPolicy(policy =>
    {
        policy
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();

app.MapCarter();

app.Run();