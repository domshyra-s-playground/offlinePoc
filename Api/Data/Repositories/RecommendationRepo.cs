using Database;
using Entities;
using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Repositories
{
    public class RecommendationRepo : IRecommendationRepo
    {
        private readonly PlaylistDbContext _context;

        public RecommendationRepo(PlaylistDbContext context)
        {
            _context = context;
        }

        public async Task<List<PlaylistRecommendationDto>> GetRecommendations()
        {
            return await _context.Recommendations.Select(e => EntityToDetailDto(e)).ToListAsync();
        }

        public async Task<PlaylistRecommendationDto?> GetRecommendation(string id)
        {
            Guid objId = Guid.Parse(id);
            var entity = await _context.Recommendations.Include(x => x.Suggestions).SingleOrDefaultAsync(h => h.Id == objId);
            if (entity == null)
                return null;
            return EntityToDetailDto(entity);
        }

        private static PlaylistRecommendationDto EntityToDetailDto(PlaylistRecommendationEntity entity)
        {
            List<SongDto> suggestions = entity.Suggestions.Select(s => new SongDto(s.Id, s.PlaylistRecommendationEntityId, s.Title, s.Artist)).ToList();
            return new PlaylistRecommendationDto(entity.Id, entity.Name, entity.Description, entity.Genre, suggestions);
        }

        public async Task<PlaylistRecommendationDto> AddRecommendation(PlaylistRecommendationDto recommendation)
        {
            Guid guid = Guid.NewGuid();
            var entity = new PlaylistRecommendationEntity
            {
                Id = guid,
                Name = recommendation.Name,
                Description = recommendation.Description,
                Genre = recommendation.Genre,
                Suggestions = recommendation.Suggestions is null ?
                new List<SongEntity>() :
                recommendation.Suggestions.Select(s => new SongEntity { Id = Guid.NewGuid(), PlaylistRecommendationEntityId = guid, Title = s.Title, Artist = s.Artist }).ToList()
            };
            _context.Entry(entity).State = EntityState.Added;
            _context.Songs.AddRange(entity.Suggestions);
            _context.Recommendations.Add(entity);
            await _context.SaveChangesAsync();
            return EntityToDetailDto(entity);
        }

        public async Task<PlaylistRecommendationDto> UpdateRecommendation(PlaylistRecommendationDto recommendation)
        {
            var entity = await _context.Recommendations.Include(x => x.Suggestions).SingleOrDefaultAsync(h => h.Id == recommendation.Id) ?? throw new Exception($"Recommendation with id {recommendation.Id} not found");
            entity.Description = recommendation.Description;
            entity.Name = recommendation.Name;
            entity.Genre = recommendation.Genre;

            //remove all suggestions
            foreach (var suggestion in entity.Suggestions)
            {
                _context.Entry(suggestion).State = EntityState.Deleted;
            }
            entity.Suggestions.Clear();

            //add new suggestions
            foreach (var suggestion in recommendation.Suggestions)
            {
                if (string.IsNullOrWhiteSpace(suggestion.Title) || string.IsNullOrWhiteSpace(suggestion.Artist))
                {
                    continue;
                }
                var song = new SongEntity { Id = Guid.NewGuid(), PlaylistRecommendationEntityId = recommendation.Id, Title = suggestion.Title, Artist = suggestion.Artist };
                entity.Suggestions.Add(song);
                _context.Entry(song).State = EntityState.Added;
            }

            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return EntityToDetailDto(entity);
        }

        public async Task DeleteRecommendation(string id)
        {
            Guid objId = Guid.Parse(id);
            var entity = await _context.Recommendations.SingleOrDefaultAsync(h => h.Id == objId);
            if (entity == null)
                throw new Exception($"Recommendation with id {id} not found");
            _context.Recommendations.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}