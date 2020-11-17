using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using ScopicTestTask.CustomAuthentication;
using ScopicTestTask.Data;
using ScopicTestTask.Models;
using ScopicTestTask.Models.ViewModels;


namespace ScopicTestTask.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class AntiqueController : ControllerBase
    {
        private IWebHostEnvironment _environment;
        private ApplicationDbContext _context;

        public AntiqueController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [CustomAuthorize(Role = "user", Api = true)]
        [HttpGet("ClientGetAntiqueById/{id}")]
        public IActionResult ClientGetAntiqueById(int id)
        {
            Antique antique = _context.Antiques.Where(a => a.Id == id).SingleOrDefault();
            HomePageViewModel model = new HomePageViewModel();
            model.Id = antique.Id;
            model.Name = antique.Name;
            model.Description = antique.Description;
            model.BasePrice = antique.BasePrice;
            model.CurrentBid = antique.CurrentBid;
            model.BidEnd = antique.BidEndTime;
            model.PhotoPaths = _context.Photos.Where(p => p.AntiqueId == antique.Id).Select(p => p.Path).ToList();
            return Ok(model);
        }

        [CustomAuthorize(Role = "user", Api = true)]
        [HttpGet("ClientGetAllAntiques")]
        public IActionResult ClientGetAllAntiques()
        {
            DateTime localDate = DateTime.Now;
            List<Antique> antiques = _context.Antiques.Where(a => a.BidStartTime <= localDate && a.BidEndTime >= localDate).ToList();
            List<HomePageViewModel> dtoList = new List<HomePageViewModel>();
            HomePageViewModel temp = null;
            foreach (Antique antique in antiques)
            {
                temp = new HomePageViewModel()
                {
                    Id = antique.Id,
                    Name = antique.Name,
                    Description = antique.Description,
                    BasePrice = antique.BasePrice,
                    CurrentBid = antique.CurrentBid
                };
                List<string> photoPaths = _context.Photos.Where(p => p.AntiqueId == antique.Id).Select(p => p.Path).ToList();
                if (photoPaths != null)
                {
                    temp.PhotoPaths = new List<string>();
                    foreach (string path in photoPaths)
                    {
                        temp.PhotoPaths.Add(path);
                    }
                }

                dtoList.Add(temp);
            }
            return Ok(dtoList);
        }


        [CustomAuthorize(Role = "admin", Api = true)]
        [HttpGet("GetAllAntiques")]
        public IActionResult GetAllAntiques()
        {
            List<Antique> antiques = _context.Antiques.ToList();
            List<AntiquePhotoViewModel> dtoList = new List<AntiquePhotoViewModel>();
            AntiquePhotoViewModel temp = null;
            foreach (Antique antique in antiques)
            {
                temp = new AntiquePhotoViewModel()
                {
                    Id = antique.Id,
                    Name = antique.Name,
                    PhotoPath = _context.Photos.Where(p => p.AntiqueId == antique.Id).Select(p => p.Path).Take(1).SingleOrDefault(),
                    Description = antique.Description,
                    BasePrice = antique.BasePrice,
                    CurrentBid = antique.CurrentBid,
                    BidStartTime = antique.BidStartTime,
                    BidEndTime = antique.BidEndTime
                };
                dtoList.Add(temp);
            }
            return Ok(dtoList);
        }
        [CustomAuthorize(Role = "admin", Api = true)]
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            Antique antique = _context.Antiques.Where(a => a.Id == id).SingleOrDefault();
            return Ok(antique);
        }

        private bool validate(AntiqueDTO antiqueDto)
        {
            if (antiqueDto == null || string.IsNullOrEmpty(antiqueDto.Name) ||
                string.IsNullOrEmpty(antiqueDto.Description) ||
                string.IsNullOrEmpty(antiqueDto.BidStartTime) ||
                string.IsNullOrEmpty(antiqueDto.BidEndTime)
               )
            {
                return false;
            }
            return true;
        }

        [CustomAuthorize(Role = "admin", Api = true)]
        [HttpPost("AddAntique")]
        public IActionResult AddAntique([FromBody] AntiqueDTO antiqueDto)
        {
            if (validate(antiqueDto))
            {
                Antique newAntique = new Antique();
                newAntique.Name = antiqueDto.Name;
                newAntique.Description = antiqueDto.Description;
                newAntique.BasePrice = Convert.ToDecimal(antiqueDto.BasePrice);
                newAntique.CurrentBid = 0;
                string format = "d MMMM yyyy hh:mm tt";
                newAntique.BidStartTime = DateTime.ParseExact(antiqueDto.BidStartTime, format, CultureInfo.InvariantCulture);
                newAntique.BidEndTime = DateTime.ParseExact(antiqueDto.BidEndTime, format, CultureInfo.InvariantCulture);
                _context.Add(newAntique);
                _context.SaveChanges();
                int antiqueId = _context.Antiques.OrderByDescending(a => a.Id).Select(a => a.Id).FirstOrDefault();
                return Ok(antiqueId);
            }
            return StatusCode(1);
        }

        [CustomAuthorize(Role = "admin", Api = true)]
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] AntiqueDTO antiqueDto)
        {
            if (validate(antiqueDto))
            {
                Antique toUpdate = _context.Antiques.Where(a => a.Id == id).SingleOrDefault();
                toUpdate.Name = antiqueDto.Name;
                toUpdate.Description = antiqueDto.Description;
                toUpdate.BasePrice = Convert.ToDecimal(antiqueDto.BasePrice);

                string format = "yyyy/M/d H:mm";
                toUpdate.BidStartTime = DateTime.ParseExact(antiqueDto.BidStartTime, format, CultureInfo.InvariantCulture);
                toUpdate.BidEndTime = DateTime.ParseExact(antiqueDto.BidEndTime, format, CultureInfo.InvariantCulture);

                _context.Update(toUpdate);
                _context.SaveChanges();
                return Ok("Antique updated successfully");
            }
            return StatusCode(1);
        }

        [CustomAuthorize(Role = "admin", Api = true)]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Antique toDelete = _context.Antiques.Where(a => a.Id == id).SingleOrDefault();
            List<Photo> photos = _context.Photos.Where(p => p.AntiqueId == id).ToList();
            if (photos != null)
            {
                foreach (Photo photo in photos)
                {
                    System.IO.File.Delete(_environment.WebRootPath + "" + photo.Path);
                    _context.Remove(photo);
                    _context.SaveChanges();
                }
            }
            _context.Remove(toDelete);
            _context.SaveChanges();

            return Ok();
        }
    }
}
