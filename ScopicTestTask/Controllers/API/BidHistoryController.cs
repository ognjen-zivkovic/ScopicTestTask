using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScopicTestTask.CustomAuthentication;
using ScopicTestTask.Data;
using ScopicTestTask.Models;

namespace ScopicTestTask.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class BidHistoryController : ControllerBase
    {
        private ApplicationDbContext _context;

        public BidHistoryController(ApplicationDbContext context)
        {
            _context = context;
        }
        [CustomAuthorize(Role = "All", Api = true)]
        [HttpGet("{antiqueId}")]
        public IActionResult Get(int antiqueId)
        {
            List<BidHistory> bidHistories = _context.BidHistories.Where(b => b.AntiqueId == antiqueId).ToList();
            return Ok(bidHistories);

        }

        [HttpPost]
        [CustomAuthorize(Role = "user", Api = true)]
        public IActionResult Post([FromBody] BidHistory history)
        {
            string userWithTheHighestBid = _context.BidHistories.Where(b=>b.AntiqueId == history.AntiqueId).OrderByDescending(b => b.BidAmount).Select(b => b.User).Take(1).SingleOrDefault();
            string loggedInUser = CustomAuthentication.AppContext.Current.Session.GetString("user");
            if ((string.IsNullOrEmpty(userWithTheHighestBid) || userWithTheHighestBid != loggedInUser) && !string.IsNullOrEmpty(loggedInUser))
            {
                Antique antique = _context.Antiques.Where(a => a.Id == history.AntiqueId).SingleOrDefault();
                DateTime localDate = DateTime.Now;
                if (antique.BidEndTime < localDate)
                {
                    return StatusCode(2);
                }

                if (antique.CurrentBid < history.BidAmount)
                {
                    BidHistory bidHistory = new BidHistory();
                    bidHistory.AntiqueId = history.AntiqueId;
                    bidHistory.BidAmount = history.BidAmount;
                    bidHistory.BidTime = localDate;
                    bidHistory.User = loggedInUser;

                    antique.CurrentBid = history.BidAmount;
                    _context.Update(antique);
                    _context.Add(bidHistory);
                    _context.SaveChanges();
                }
                else 
                {
                    return StatusCode(3);
                }
            }
            else
            {
                return StatusCode(1);
            }

            return Ok(history.BidAmount);
        }
    }
}
