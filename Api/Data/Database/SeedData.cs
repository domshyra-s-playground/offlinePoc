using Api.Migrations;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Database
{
    public static class SeedData
    {
        public static void Seed(ModelBuilder builder)
        {
            builder.Entity<PlaylistRatingEntity>().HasData(new List<PlaylistRatingEntity> {
            new PlaylistRatingEntity {
                Id = new Guid("cc89279a-1ebb-49c3-9a0d-f704c61b5d0a"),
                Rating = 5,
                PlaylistId = "4wPdda9xSZy2ffI47Bo696"
            },
            });
            builder.Entity<RoleEntity>().HasData(new List<RoleEntity> {
            new RoleEntity {
                Id = "4f3050e0-6300-487e-9bd1-a8862f40b2d1",
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            });
        }
    }

}