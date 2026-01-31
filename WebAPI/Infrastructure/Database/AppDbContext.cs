using Microsoft.EntityFrameworkCore;
using WebAPI.Domain.Entities;

namespace WebAPI.Infrastructure.Database;

public sealed class AppDbContext : DbContext
{
    public DbSet<Url> Urls { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("DataSource=shorten.db");
    }
}
