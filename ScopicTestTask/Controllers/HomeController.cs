using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScopicTestTask.Models;
using ScopicTestTask.CustomAuthentication;

namespace ScopicTestTask.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Login()
        {
            User user = new User();
            return View(user);
        }

        [HttpPost]
        public IActionResult Login(User user)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            HttpContext.Session.Clear();
            CustomAuthentication.CustomAuthorize.SetSession(user);
            if (user.UserName == "admin" && user.Password == "admin")
            {
                return RedirectToAction("AntiqueList", "AdminPanelAntiques");
            }
            else if (user.UserName == "user" && user.Password == "user")
            {
                return View("Index");
            }
            else if (user.UserName == "user2" && user.Password == "user2")
            {
                return View("Index");
            }
            return View();
        }
        [CustomAuthorize(Role = "user")]
        public IActionResult Index()
        {
            return View();
        }

        [CustomAuthorize(Role = "user")]
        public IActionResult ItemDetails([FromQuery(Name = "antiqueId")] int antiqueId)
        {
            return View(antiqueId);
        }
    }
}
