using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ScopicTestTask.CustomAuthentication;

namespace ScopicTestTask.Controllers
{
    public class AdminPanelAntiquesController : Controller
    {

       // [CustomAuthorize(Role = "admin")]
        public IActionResult AntiqueList()
        {
            return View("AntiqueList");
        }
    }
}
