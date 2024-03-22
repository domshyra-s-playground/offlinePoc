namespace Entities
{
    public class SongEntity
    {
        public Guid Id { get; set; }
        public Guid PlaylistRecommendationEntityId { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }

        public PlaylistRecommendationEntity PlaylistRecommendationEntity { get; set; }

    }
}