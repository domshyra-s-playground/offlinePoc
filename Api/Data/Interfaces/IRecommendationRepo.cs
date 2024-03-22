using Microsoft.EntityFrameworkCore;

namespace Interfaces
{
    public interface IRecommendationRepo
    {
        Task<List<PlaylistRecommendationDto>> GetRecommendations();
        Task<PlaylistRecommendationDto?> GetRecommendation(string id);
        Task<PlaylistRecommendationDto> AddRecommendation(PlaylistRecommendationDto recommendation);
        Task<PlaylistRecommendationDto> UpdateRecommendation(PlaylistRecommendationDto recommendation);
        Task DeleteRecommendation(string id);
    }
}