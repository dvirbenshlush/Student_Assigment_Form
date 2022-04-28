using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace student_assignment_form.Dal
{
    public class LogsHelper
    {

        public static string pathString = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "log.txt");
        public static void writeToLog(string sentnce)
        {
            using (StreamWriter sw = System.IO.File.AppendText(pathString))
            {
                sw.WriteLine(sentnce);
            }
        }

        public static void clearLog()
        {
            System.IO.File.WriteAllText(pathString, string.Empty);
        }
    }
}
