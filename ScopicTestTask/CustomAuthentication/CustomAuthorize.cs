
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using ScopicTestTask.Models;

namespace ScopicTestTask.CustomAuthentication
{
    public class CustomAuthorize : ActionFilterAttribute
    {
        public string Role { get; set; }

        public bool Api { get; set; }
        public static void SetSession(User user)
        {
            if (user.UserName == "admin")
                AppContext.Current.Session.SetString("admin", user.UserName);
            else
                AppContext.Current.Session.SetString("user", user.UserName);

            AppContext.Current.Session.SetString("All", user.UserName);
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (AppContext.Current.Session.GetString(Role) == null)
            {
                if (Api == false)
                {
                    context.Result =
                    new RedirectToRouteResult(new RouteValueDictionary
                         {
                               { "action", "Login" },
                             { "controller", "Home" }
                          });
                    return;
                }
                else
                {
                    context.Result = new StatusCodeResult(401);
                    return;
                }
            }
        }
    }
}
