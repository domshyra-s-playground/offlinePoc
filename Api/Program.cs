using Interfaces;
using Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.ApplicationInsights;
using Database;
using Microsoft.EntityFrameworkCore.SqlServer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllersWithViews();
//TODO remove
builder.Services.AddCors();
// Add this using directive

builder.Services.AddDbContext<PlaylistDbContext>(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        // options.UseSqlServer($"Data Source=(LocalDB)\\MSSQLLocalDB;PlaylistDb.mdf;Integrated Security=True;Connect Timeout=30");
        options.UseSqlServer($"Data Source=(LocalDB)\\MSSQLLocalDB;Database=PlaylistDb;Integrated Security=True;Connect Timeout=30");
    }
    else if (builder.Environment.IsProduction())
    {
        options.UseSqlServer(builder.Configuration.GetConnectionString("PlaylistDb"));
    }
    else
    {
        throw new Exception("Env not specified");
    }
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
});


builder.Services.AddApplicationInsightsTelemetry();

builder.Services.AddScoped<ISpotifyRepo, SpotifyRepo>();
builder.Services.AddScoped<IPlaylistRepo, PlaylistRepo>();
builder.Services.AddScoped<IRecommendationRepo, RecommendationRepo>();

var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
// }
app.UseStaticFiles();
app.UseHttpsRedirection();

//Routes
UseSpotifyPlaylistRoutes(app);
UseRatingsRoutes(app);
UseRecommendationsRoutes(app);


//TODO remove
app.UseCors(p => p.WithOrigins(app.Configuration["FrontEndUrl"]).AllowAnyHeader().AllowAnyMethod());
app.UseRouting();
app.UseEndpoints(e => e.MapDefaultControllerRoute());
app.MapFallbackToFile("index.html");


app.Run();

static void UseSpotifyPlaylistRoutes(WebApplication app)
{
    app.MapGet("/spotify", async (ISpotifyRepo _spotifyProvider) =>
    {
        app.Logger.LogInformation("Getting playlists");
        return await _spotifyProvider.GetPlaylists();
    }).WithName("GetSpotifyPlaylists").WithTags("Spotify");

    app.MapGet("/spotify/{playlistId}", async (string playlistId, ISpotifyRepo _spotifyProvider) =>
    {
        app.Logger.LogInformation($"Getting playlist with id {playlistId}");
        return await _spotifyProvider.GetPlaylist(playlistId);
    }).WithName("GetSpotifyPlaylist").WithTags("Spotify");

    app.MapGet("/spotify/genres", async (ISpotifyRepo _spotifyProvider) =>
    {
        return await _spotifyProvider.GetGenres();
    }).WithName("GetSpotifyGenres").WithTags("Spotify");
}

static void UseRatingsRoutes(WebApplication app)
{
    app.MapGet("/ratings", (IPlaylistRepo repo) => repo.GetRatings()).Produces<PlaylistRatingDto[]>(StatusCodes.Status200OK).WithTags("Ratings");
    app.MapGet("/ratings/{playlistId}", async (string playlistId, IPlaylistRepo repo) =>
    {
        var rating = await repo.GetRating(playlistId);
        if (rating == null)
            return Results.NoContent();
        return Results.Ok(rating);
    }).Produces<PlaylistRatingDto>(StatusCodes.Status200OK).Produces(StatusCodes.Status204NoContent).WithTags("Ratings");

    app.MapPost("/ratings/{playlistId}", async (string playlistId, [FromBody] int rating, IPlaylistRepo repo) =>
    {
        var newRating = await repo.AddRating(playlistId, rating);
        return Results.Created($"/ratings/{newRating.Id}", newRating);
    }).Produces<PlaylistRatingDto>(StatusCodes.Status201Created).WithTags("Ratings");

    app.MapPut("/ratings/{playlistId}", async (string playlistId, [FromBody] int rating, IPlaylistRepo repo) =>
    {
        var existingRating = await repo.GetRating(playlistId);
        if (existingRating == null)
            return Results.NoContent();
        var updatedRating = await repo.UpdateRating(playlistId, rating);
        return Results.Ok(updatedRating);
    }).Produces<PlaylistRatingDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status204NoContent).WithTags("Ratings");

    app.MapDelete("/ratings/{id}", async (string id, IPlaylistRepo repo) =>
    {
        await repo.DeleteRating(id);
        return Results.Ok();
    }).Produces(StatusCodes.Status200OK).WithTags("Ratings");
}

static void UseRecommendationsRoutes(WebApplication app)
{
    app.MapGet("/recommendations", (IRecommendationRepo repo) => repo.GetRecommendations()).Produces<PlaylistRecommendationDto[]>(StatusCodes.Status200OK).WithTags("Recommendations");
    app.MapGet("/recommendations/{id}", async (string id, IRecommendationRepo repo) =>
    {
        var record = await repo.GetRecommendation(id);
        if (record == null)
            return Results.NoContent();
        return Results.Ok(record);
    }).Produces<PlaylistRecommendationDto>(StatusCodes.Status200OK).Produces(StatusCodes.Status204NoContent).WithTags("Recommendations");

    app.MapPost("/recommendations", async ([FromBody] PlaylistRecommendationDto recommendation, IRecommendationRepo repo) =>
    {
        var newRecord = await repo.AddRecommendation(recommendation);
        return Results.Created($"/recommendations/{newRecord.Id}", newRecord);
    }).Produces<PlaylistRecommendationDto>(StatusCodes.Status201Created).WithTags("Recommendations");

    app.MapPut("/recommendations", async ([FromBody] PlaylistRecommendationDto recommendation, IRecommendationRepo repo) =>
    {
        var existingRecord = await repo.GetRecommendation(recommendation.Id.ToString());
        if (existingRecord == null)
            return Results.NoContent();
        var updatedRecord = await repo.UpdateRecommendation(recommendation);
        return Results.Ok(updatedRecord);
    }).Produces<PlaylistRecommendationDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status204NoContent).WithTags("Recommendations");

    app.MapDelete("/recommendations/{id}", async (string id, IRecommendationRepo repo) =>
    {
        await repo.DeleteRecommendation(id);
        return Results.Ok();
    }).Produces(StatusCodes.Status200OK).WithTags("Recommendations");
}