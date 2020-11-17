using Microsoft.EntityFrameworkCore.Migrations;

namespace ScopicTestTask.Migrations
{
    public partial class AddedBidAmountCollumnToBidHistoryTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "BidAmount",
                table: "BidHistory",
                type: "numeric(13,0)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BidAmount",
                table: "BidHistory");
        }
    }
}
