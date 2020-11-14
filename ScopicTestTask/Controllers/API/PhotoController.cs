using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScopicTestTask.Data;
using ScopicTestTask.Models;
using ScopicTestTask.Models.DTOs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ScopicTestTask.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private IWebHostEnvironment _environment;
        private ApplicationDbContext _context;
        public PhotoController(IWebHostEnvironment environment, ApplicationDbContext context)
        {
            _environment = environment;
            _context = context;
        }


        public class FileUploadAPI
        {
            public IList<IFormFile> photos { get; set; }
            public int AntiqueId { get; set; }
        }


        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            List<Photo> photos = new List<Photo>();
            photos = _context.Photos.Where(p=>p.AntiqueId == id).ToList();
            return Ok(photos);
        }




        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Photo toDelete = _context.Photos.Where(p => p.Id == id).SingleOrDefault();
            System.IO.File.Delete(_environment.WebRootPath + "" + toDelete.Path);
            _context.Remove(toDelete);
            _context.SaveChanges();
            return Ok("Photo successfully deleted");
        }

        [HttpPost]
        public string Post([FromForm] FileUploadAPI objFile)
        {
            try
            {
                if (objFile.photos.Count > 0)
                {
                    if (!Directory.Exists(_environment.WebRootPath + "\\AntiquePhotos\\"))
                    {
                        Directory.CreateDirectory(_environment.WebRootPath + "\\AntiquePhotos\\");
                    }

                    FileStream fileStream = null;
                    Photo newPhoto = null;
                    foreach (IFormFile file in objFile.photos)
                    {
                        using (fileStream = System.IO.File.Create(_environment.WebRootPath + "\\AntiquePhotos\\" + file.FileName))
                        {
                            file.CopyTo(fileStream);
                        }
                        newPhoto = new Photo();
                        newPhoto.AntiqueId = objFile.AntiqueId;
                        newPhoto.Path = "\\AntiquePhotos\\" + file.FileName;
                        _context.Add(newPhoto);
                        _context.SaveChanges();
                    }
                    
                    return "Photos successfully added";
                }
                else
                {
                    return "Failed";
                }
            }
            catch (Exception ex)
            {

                return ex.Message.ToString();
            }
        }
    }
}
