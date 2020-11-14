using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScopicTestTask.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Path { get; set; }
        public int AntiqueId { get; set; }

        public virtual Antique Antique { get; set; }
    }
}
