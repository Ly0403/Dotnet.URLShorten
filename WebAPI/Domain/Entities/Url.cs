namespace WebAPI.Domain.Entities;

public sealed class Url
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public string LongUrl { get; init; } = string.Empty;
    public string ShortUrl { get; init; } = string.Empty;
    public string Code { get; init; } =string.Empty;
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
}
