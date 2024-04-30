using Interfaces;
using Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.ApplicationInsights;
using Database;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.AspNetCore.JsonPatch;
using Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(setUpActions =>
            {
                setUpActions.SwaggerDoc("v1", new OpenApiInfo { Title = "Api", Version = "v1" });
                setUpActions.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme. <br/> 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      <br/>Example: 'Bearer 12345abcdef'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                setUpActions.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                      {
                        Reference = new OpenApiReference
                          {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                          },
                          Scheme = "oauth2",
                          Name = "Bearer",
                          In = ParameterLocation.Header,

                        },
                        new List<string>()
                      }
                    });

                string xmlCommentsFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                string xmlFullPath = Path.Combine(AppContext.BaseDirectory, xmlCommentsFile);

                setUpActions.IncludeXmlComments(xmlFullPath);
            });
builder.Services.AddControllersWithViews();
//TODO remove
builder.Services.AddCors();
builder.Services.AddAuthorization();

// add db context
builder.Services.AddDbContext<PlaylistDbContext>(options =>
{
    if (builder.Environment.IsDevelopment())
    {
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

// add identity services
builder.Services
    .AddIdentityApiEndpoints<UserEntity>()
    .AddRoles<RoleEntity>()
    .AddEntityFrameworkStores<PlaylistDbContext>();


builder.Services.AddApplicationInsightsTelemetry();

//For json patch
//?https://learn.microsoft.com/en-us/aspnet/core/web-api/jsonpatch
builder.Services.AddControllers().AddNewtonsoftJson();

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
app.MapControllers();


//Routes
UseSpotifyPlaylistRoutes(app);
UseRatingsRoutes(app);
// app.MapGet("/secretSecret", () => { return "I've got a secret!"; }).WithName("Secret").WithTags("Secret").RequireAuthorization("admin");
app.MapGroup("/account").WithTags("Account").MapIdentityApi<UserEntity>();

//TODO remove
app.UseCors(p => p.WithOrigins(app.Configuration["FrontEndUrl"]).AllowAnyHeader().AllowAnyMethod());
app.UseRouting();
app.UseAuthorization();
app.UseEndpoints(e => e.MapDefaultControllerRoute());
app.MapFallbackToFile("index.html");


app.Run();

/// <summary>
/// Spotify routes
/// </summary>
/// <param name="app"></param>
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

/// <summary>
/// Ratings routes
/// </summary>
/// <param name="app"></param>
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