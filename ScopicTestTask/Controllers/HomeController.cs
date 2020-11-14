using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ScopicTestTask.Models;
using ScopicTestTask.CustomAuthentication;
using Microsoft.AspNetCore.Authorization;

namespace ScopicTestTask.Controllers
{
    public class HomeController : Controller
    {
        public HomeController()
        {
            
        }

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
            if (user.UserName == "admin")
            {
                return RedirectToAction("AntiqueList","AdminPanelAntiques");
            }

            return View();
        }
        //  [CustomAuthorize(Role = "user")]
        public IActionResult Index()
        {

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
