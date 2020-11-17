using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScopicTestTask.Models
{
    public class BidHistory
    {
        public int Id { get; set; }
        public DateTime BidTime { get; set; }
        public decimal BidAmount { get; set; }
        public int AntiqueId { get; set; }

        public string User { get; set; }
        public virtual Antique Antique { get; set; }
    }
}
