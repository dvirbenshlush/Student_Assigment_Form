using Microsoft.EntityFrameworkCore;
using student_assignment_form.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace student_assignment_form.Data
{
    public class DataDbContext : DbContext
    {
        public DataDbContext(DbContextOptions<DataDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Student> Student { set; get; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    base.OnModelCreating(modelBuilder);
        //    modelBuilder.Entity<Student>(e => e.Property(o => o.homeNumber).HasColumnType("tinyint(1)").HasConversion<short>());
        //}
    }
}
