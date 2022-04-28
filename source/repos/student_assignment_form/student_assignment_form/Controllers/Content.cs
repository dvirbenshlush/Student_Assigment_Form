using Microsoft.AspNetCore.Mvc;
using student_assignment_form.Data;

namespace student_assignment_form.models
{
    internal class Content : ActionResult
    {
        private Student student;

        public Content(Student student)
        {
            this.student = student;
        }

        public int StatusCode { get; set; }
    }
}