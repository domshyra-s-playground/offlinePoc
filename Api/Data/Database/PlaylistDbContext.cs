using Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace Database
{
    //?EF tools here
    //?https://learn.microsoft.com/en-us/ef/core/cli/dotnet

    //?EF Migrations here
    //?https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/?tabs=dotnet-core-cli

    //?EF Identity here
    //?https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-8.0&tabs=netcore-cli


    public class PlaylistDbContext : IdentityDbContext<UserEntity>
    {
        public PlaylistDbContext(DbContextOptions<PlaylistDbContext> options) : base(options) { }
        public DbSet<PlaylistRatingEntity> Ratings => Set<PlaylistRatingEntity>();
        public DbSet<PlaylistRecommendationEntity> Recommendations => Set<PlaylistRecommendationEntity>();
        public DbSet<SongEntity> Songs => Set<SongEntity>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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