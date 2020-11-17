using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScopicTestTask.Models.ViewModels
{
    public class AntiquePhotoDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal BasePrice { get; set; }
        public decimal? CurrentBid { get; set; }
        public DateTime BidStartTime { get; set; }
        public DateTime BidEndTime { get; set; }

        public string PhotoPath { get; set; }

    }
}
