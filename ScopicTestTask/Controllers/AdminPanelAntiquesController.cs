using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ScopicTestTask.Controllers
{
    public class AdminPanelAntiquesController : Controller
    {
        public IActionResult AntiqueList()
        {
            return View("AntiqueList");
        }
    }
}
