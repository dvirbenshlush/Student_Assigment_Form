using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using student_assignment_form.Data;
using student_assignment_form.models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace student_assignment_form.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly DataDbContext _context;

        public StudentsController(DataDbContext context)
        {
            _context = context;
        }

   


        // GET: api/Students
        [HttpGet("GetAllStudents")]
        public dynamic GetAllStudents()
        {
            Response response = new Response();
            List<Student> studentsResult = new List<Student>();
            studentsResult.AddRange( _context.Student.Where(student => student.Register == true)
                .Distinct().ToList());

      
            if (studentsResult == null)
            {
                response.Error =  "not found";
            }
            DataTable dataTable = ListOfStudentsToDataTable(studentsResult);
            var path = Path.Combine("C:/Users/dvirb/Downloads/Backup Files", "result.csv");

            convertDataTableToCSV(dataTable, path);
            response.Value = new OkResult();

            return response;
        }

        public static DataTable ListOfStudentsToDataTable(List<Student> studentsResult)
        {
            DataTable dataTable = new DataTable();


            dataTable.Columns.Add("תעודת זהות");
            dataTable.Columns.Add("שם פרטי");
            dataTable.Columns.Add("שם משפחה");
            dataTable.Columns.Add("מין");
            dataTable.Columns.Add("תאריך לידה");
            dataTable.Columns.Add("institution");
            dataTable.Columns.Add("מס' בית");
            dataTable.Columns.Add("פלאפון");
            dataTable.Columns.Add("email");
            dataTable.Columns.Add("ארץ");
            dataTable.Columns.Add("immigration");
            dataTable.Columns.Add("nation");


            foreach (Student item in studentsResult)
            {
                DataRow row = dataTable.NewRow();
                row.ItemArray = new string[12] { item.identify.ToString(), item.firstName, item.lastName, item.gender, item.birthday.ToString(), item.institution, item.homeNumber.ToString(), item.mobile.ToString(), item.email, item.country, item.immigration, item.nation };
                dataTable.Rows.Add(row);
            }
            return dataTable;
        }

        public static dynamic convertDataTableToCSV(DataTable dtInit, string path)
        {

            try
            {
                StreamWriter sw = new StreamWriter(path, false, Encoding.UTF8);
                int countOfRows = 0;
                //headers
                for (int i = 0; i < dtInit.Columns.Count; i++)
                {
                    sw.Write(dtInit.Columns[i]);
                    if (i < dtInit.Columns.Count - 1)
                    {
                        sw.Write(",");
                    }
                }
                sw.Write(sw.NewLine);
                foreach (DataRow dr in dtInit.Rows)
                {
                    countOfRows++;
                    for (int i = 0; i < dtInit.Columns.Count; i++)
                    {
                        if (!Convert.IsDBNull(dr[i]))
                        {
                            string value = dr[i].ToString();
                            if (value.Contains(','))
                            {
                                value = String.Format("\"{0}\"", value);
                                sw.Write(value);
                            }
                            else
                            {
                                sw.Write(dr[i].ToString());
                            }
                        }
                        if (i < dtInit.Columns.Count - 1)
                        {
                            sw.Write(",");
                        }
                    }
                    sw.Write(sw.NewLine);
                }

                sw.Close();
                return true;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpPost("UpdateStudentsList")]
        public dynamic UpdateStudentsList([FromBody] JObject studentObject)
        {
            Response response = new Response();
            try
            {
                int id = (int)JObject.Parse(studentObject.ToString())["body"]["identify"];
                Student student = new Student(id);

                List<Student> studentsResult = new List<Student>();
                studentsResult.AddRange(_context.Student.Where(studentInSQL => studentInSQL.identify == id)
                    .Distinct().ToList());

                var result = _context.Student.SingleOrDefault(b => b.identify == id);
                if (result != null)
                {
                    result.Register = true;
                    _context.SaveChanges();
                    response.Value = new OkResult();
                }
                else
                {
                    response.Error = "this student not exist in db";
                }
            }
            catch (Exception e)
            {
                response.Error = "There is server error";
                #if DEBUG
                    response.Error = e.Message;
                #endif
            }

            return response;
        }

   
    }





}

