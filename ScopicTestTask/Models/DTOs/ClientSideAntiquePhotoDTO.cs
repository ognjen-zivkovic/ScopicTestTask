using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScopicTestTask.Models.DTOs
{
    public class ClientSideAntiquePhotoDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal BasePrice { get; set; }
        public decimal? CurrentBid { get; set; }
        public List<string> PhotoPaths { get; set; }
    }
}
