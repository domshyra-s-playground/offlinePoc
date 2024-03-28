using System.Runtime.CompilerServices;
using Interfaces;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [Route("recommendations")]
    [ApiController]
    public class RecommendationsController : ControllerBase
    {
        private readonly IRecommendationRepo _repository;
        private readonly ILogger<RecommendationsController> _logger;
        public RecommendationsController(IRecommendationRepo repository, ILogger<RecommendationsController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        // GET: api/Recommendations
        [HttpGet]
        public async Task<ActionResult<List<PlaylistRecommendationDto>>> GetRecommendations()
        {
            return Ok(await _repository.GetRecommendations());
        }

        // GET: api/Recommendations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PlaylistRecommendationDto>> GetRecommendationAsync(string id)
        {
            var recommendation = await _repository.GetRecommendation(id);

            if (recommendation == null)
            {
                return NotFound();
            }

            return Ok(recommendation);
        }

        // PUT: api/Recommendations
        [HttpPut]
        public async Task<IActionResult> PutRecommendationAsync([FromBody] PlaylistRecommendationDto recommendation)
        {
            var existingRecord = await _repository.GetRecommendation(recommendation.Id.ToString());
            if (existingRecord == null)
            {
                return NoContent();

            }

            var updatedRecord = await _repository.UpdateRecommendation(recommendation);
            return Ok(updatedRecord);
        }

        // POST: api/Recommendations
        [HttpPost]
        public async Task<ActionResult<PlaylistRecommendationDto>> PostRecommendationAsync([FromBody] PlaylistRecommendationDto recommendation)
        {
            var newRecord = await _repository.AddRecommendation(recommendation);

            return CreatedAtAction("GetRecommendation", new { id = newRecord.Id }, newRecord);
        }

        // Patch: api/Recommendations/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchRecommendationAsync(string id, [FromBody] JsonPatchDocument<PlaylistRecommendationDto> patch)
        {
            var existingRecord = await _repository.GetRecommendation(id);
            if (existingRecord == null)
            {
                return NotFound();
            }

            patch.ApplyTo(existingRecord);
            await _repository.UpdateRecommendation(existingRecord);

            return Ok(existingRecord);
        }

        // DELETE: api/Recommendations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecommendationAsync(string id)
        {
            var existingRecord = await _repository.GetRecommendation(id);
            if (existingRecord == null)
            {
                return NotFound();
            }

            await _repository.DeleteRecommendation(id);

            return Ok();
        }
    }
}