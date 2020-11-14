using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScopicTestTask.Models
{
    public class Antique
    {
        public Antique()
        {
            BidHistories = new HashSet<BidHistory>();
            Photos = new HashSet<Photo>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal BasePrice { get; set; }
        public decimal? CurrentBid { get; set; }
        public DateTime BidStartTime { get; set; }
        public DateTime BidEndTime { get; set; }

        public virtual ICollection<BidHistory> BidHistories { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
    }
}
