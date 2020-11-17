using Microsoft.EntityFrameworkCore.Migrations;

namespace ScopicTestTask.Migrations
{
    public partial class AddedUserCollumnInTheBidHistoryTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "User",
                table: "BidHistory",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "User",
                table: "BidHistory");
        }
    }
}
