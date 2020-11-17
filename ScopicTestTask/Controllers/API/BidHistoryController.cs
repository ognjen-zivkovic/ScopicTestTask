using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("{antiqueId}")]
        public IActionResult Get(int antiqueId)
        {
            List<BidHistory> bidHistories = _context.BidHistories.Where(b => b.AntiqueId == antiqueId).ToList();
            return Ok(bidHistories);

        }

        [HttpPost]
        public IActionResult Post([FromBody] BidHistory history)
        {


            string userWithTheHighestBid = _context.BidHistories.OrderByDescending(b => b.BidAmount).Select(b => b.User).Take(1).SingleOrDefault();
            string loggedInUser = CustomAuthentication.AppContext.Current.Session.GetString("user");
            if ((string.IsNullOrEmpty(userWithTheHighestBid) || userWithTheHighestBid != loggedInUser) && !string.IsNullOrEmpty(loggedInUser))
            {
                Antique antique = _context.Antiques.Where(a => a.Id == history.AntiqueId).SingleOrDefault();
                if (antique.CurrentBid < history.BidAmount)
                {
                    BidHistory bidHistory = new BidHistory();
                    bidHistory.AntiqueId = history.AntiqueId;
                    bidHistory.BidAmount = history.BidAmount;
                    DateTime localDate = DateTime.Now;
                    bidHistory.BidTime = localDate;
                    bidHistory.User = loggedInUser;

                    antique.CurrentBid = history.BidAmount;
                    _context.Update(antique);
                    _context.Add(bidHistory);
                    _context.SaveChanges();
                }
                else 
                {
                    return StatusCode(1);
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
