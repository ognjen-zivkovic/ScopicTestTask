
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
        public static void SetSession(User user)
        {
            if (user.UserName == "admin" && user.Password == "admin")
                AppContext.Current.Session.SetString(user.UserName, user.Password);
            else if (user.UserName == "user" && user.Password == "user")
                AppContext.Current.Session.SetString(user.UserName, user.Password);
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {

            if (AppContext.Current.Session.GetString(Role) == null)
            {
                context.Result =
                 new RedirectToRouteResult(new RouteValueDictionary
                          {
                               { "action", "Login" },
                             { "controller", "Home" }
                           });
                 return;
                //context.Result = new ForbidResult();

            }
        }
    }
}
