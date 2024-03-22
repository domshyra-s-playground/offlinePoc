using Entities;
using Microsoft.EntityFrameworkCore;


namespace Database
{
    //?EF tools here
    //?https://learn.microsoft.com/en-us/ef/core/cli/dotnet

    //?EF Migrations here
    //?https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/?tabs=dotnet-core-cli


    public class PlaylistDbContext : DbContext
    {
        public PlaylistDbContext(DbContextOptions<PlaylistDbContext> options) : base(options) { }
        public DbSet<PlaylistRatingEntity> Ratings => Set<PlaylistRatingEntity>();
        public DbSet<PlaylistRecommendationEntity> Recommendations => Set<PlaylistRecommendationEntity>();
        public DbSet<SongEntity> Songs => Set<SongEntity>();

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            var folder = Environment.SpecialFolder.LocalApplicationData;
            var path = Environment.GetFolderPath(folder);
            options.UseSqlite($"Data Source={Path.Join(path, "playlist.db")}");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            SeedData.Seed(modelBuilder);

            modelBuilder.Entity<PlaylistRecommendationEntity>()
                .HasMany(p => p.Suggestions)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SongEntity>()
                .HasOne(s => s.PlaylistRecommendationEntity)
                .WithMany(p => p.Suggestions)
                .HasForeignKey(s => s.PlaylistRecommendationEntityId);

        }
    }
}