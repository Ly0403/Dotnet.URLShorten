using Carter;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using WebAPI.Domain.Entities;
using WebAPI.Infrastructure.Database;

namespace WebAPI.Presentation.Endpoints;

public sealed class ShortenEndpoint : ICarterModule
{
    private static string GenerateRandomText(int length)
    {
        const string alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var chars = new char[length];
        for (int i = 0; i < length; i++)
        {
            int idx = RandomNumberGenerator.GetInt32(alphabet.Length);
            chars[i] = alphabet[idx];
        }
        return new string(chars);
    }
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        RouteGroupBuilder shortens = app.MapGroup("/shorten");

        shortens.MapGet("/", async (
            [FromServices]AppDbContext dbContext) =>
        {
            List<Url> urls = await dbContext
                .Set<Url>()
                .AsNoTracking()
                .OrderBy(x => x.CreatedAtUtc)
                .ToListAsync();

            return Results.Ok(urls);
        });

        shortens.MapDelete("/{id}", async (
            Guid id, 
            [FromServices]AppDbContext dbContext) =>
        {
            Url? url = await dbContext.Set<Url>().FindAsync(id);
            if (url is null)
                return Results.NotFound();

            dbContext.Remove(url);

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        shortens.MapGet("/{code}", async (
            string code,
            [FromServices] AppDbContext dbContext) =>
        {
            Url? url = await dbContext
                .Set<Url>()
                .Where(x => x.Code == code)
                .FirstOrDefaultAsync();
            if (url is null)
                return Results.NotFound();

            return Results.Redirect(url.LongUrl);
        }).WithName("ShortenRedirect");

        shortens.MapPost("/", async (
            [FromForm] string url,
            [FromServices] AppDbContext dbContext,
            LinkGenerator linkGenerator,
            HttpContext httpContext) =>
        {
            string? shortUrl = null;

            string code = GenerateRandomText(7);

            for (int i = 0; i < 4; i++)
            {
                try
                {
                    shortUrl = linkGenerator.GetUriByName(httpContext, "ShortenRedirect", new { code });
                    if (shortUrl is not null)
                        break;
                }
                catch(Exception ex) {
                    Console.WriteLine( ex.Message);
                }

            }
            if (shortUrl is null)
                return Results.InternalServerError();

            Url newUrl = new()
            {
                LongUrl = url,
                ShortUrl = shortUrl,
                Code = code
            };

            dbContext.Set<Url>().Add(newUrl);

            await dbContext.SaveChangesAsync();

            return Results.Ok(newUrl);

        }).DisableAntiforgery();



    }
}
