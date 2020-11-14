using Microsoft.EntityFrameworkCore;
using ScopicTestTask.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScopicTestTask.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext()
        {

        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public virtual DbSet<Antique> Antiques { get; set; }

        public virtual DbSet<BidHistory> BidHistories { get; set; }

        public virtual DbSet<Photo> Photos { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=DESKTOP-OGNJEN;Database=ScopicTestTaskDB;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Antique>(entity =>
            {
                entity.ToTable("Antique");

                entity.Property(e => e.BasePrice).HasColumnType("numeric(13, 0)");

                entity.Property(e => e.BidEndTime).HasColumnType("datetime");

                entity.Property(e => e.BidStartTime).HasColumnType("datetime");

                entity.Property(e => e.CurrentBid).HasColumnType("numeric(13, 0)");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(65)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<BidHistory>(entity =>
            {
                entity.ToTable("BidHistory");

                entity.Property(e => e.BidTime).HasColumnType("datetime");

                entity.HasOne(d => d.Antique)
                    .WithMany(p => p.BidHistories)
                    .HasForeignKey(d => d.AntiqueId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__BidHistor__Antiq__29572725");
            });

            modelBuilder.Entity<Photo>(entity =>
            {
                entity.ToTable("Photo");

                entity.Property(e => e.Path)
                    .IsRequired()
                    .HasMaxLength(60)
                    .IsUnicode(false);

                entity.HasOne(d => d.Antique)
                    .WithMany(p => p.Photos)
                    .HasForeignKey(d => d.AntiqueId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Photo__AntiqueId__267ABA7A");
            });

        }
    }
}
