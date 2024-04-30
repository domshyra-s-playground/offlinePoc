using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [Route("secrets")]
    [ApiController]
    [Authorize]
    public class SecretController : ControllerBase
    {
        private readonly ILogger<SecretController> _logger;
        public SecretController(ILogger<SecretController> logger)
        {
            _logger = logger;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public ActionResult<string> GetSecretSecret()
        {
            return Ok("I've got a secret!");
        }

    }
}