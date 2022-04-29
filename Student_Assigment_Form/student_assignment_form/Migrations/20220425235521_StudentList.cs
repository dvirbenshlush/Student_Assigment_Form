using Microsoft.EntityFrameworkCore.Migrations;

namespace student_assignment_form.Migrations
{
    public partial class StudentList : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Register",
                table: "Student",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Register",
                table: "Student");
        }
    }
}
