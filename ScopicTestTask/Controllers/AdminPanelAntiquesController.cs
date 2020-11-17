using Microsoft.AspNetCore.Mvc;
using ScopicTestTask.CustomAuthentication;

namespace ScopicTestTask.Controllers
{
    public class AdminPanelAntiquesController : Controller
    {
       [CustomAuthorize(Role = "admin")]
        public IActionResult AntiqueList()
        {
            return View("AntiqueList");
        }
    }
}
