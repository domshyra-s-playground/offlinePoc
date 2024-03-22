using Microsoft.EntityFrameworkCore;

namespace Interfaces
{
    public interface IPlaylistRepo
    {
        Task<List<PlaylistRatingDto>> GetRatings();
        Task<PlaylistRatingDto?> GetRating(string playlistId);
        Task<PlaylistRatingDto> AddRating(string playlistId, int rating);
        Task<PlaylistRatingDto> UpdateRating(string playlistId, int rating);
        Task DeleteRating(string playlistId);
    }
}