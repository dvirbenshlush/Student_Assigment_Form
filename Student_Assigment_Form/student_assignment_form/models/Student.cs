using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace student_assignment_form.models
{
    public class Student
    {
        //internal bool Register;

      

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]

        public int identify { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string gender { get; set; }
        public string institution { get; set; }
        public DateTime birthday { get; set; }
        public int homeNumber { get; set; }
        public int mobile { get; set; }
        public string email { get; set; }
        public string country { get; set; }
        public string immigration { get; set; }
        public string nation { get; set; }
        public Boolean Register { get; set; }

        public Student(){}

        public Student(int identify)
        {
            identify = identify;
        }
    }
}
