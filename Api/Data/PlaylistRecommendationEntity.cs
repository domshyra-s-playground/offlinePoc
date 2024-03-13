public class PlaylistRecommendationEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public List<SongEntity> Suggestions { get; set; }

    public PlaylistRecommendationEntity()
    {
        Suggestions = new List<SongEntity>();
    }

}