using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ScopicTestTask.Migrations
{
    public partial class CreatedDatabase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Antique",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(65)", unicode: false, maxLength: 65, nullable: false),
                    Description = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: false),
                    BasePrice = table.Column<decimal>(type: "numeric(13,0)", nullable: false),
                    CurrentBid = table.Column<decimal>(type: "numeric(13,0)", nullable: true),
                    BidStartTime = table.Column<DateTime>(type: "datetime", nullable: false),
                    BidEndTime = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Antique", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BidHistory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BidTime = table.Column<DateTime>(type: "datetime", nullable: false),
                    AntiqueId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BidHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK__BidHistor__Antiq__29572725",
                        column: x => x.AntiqueId,
                        principalTable: "Antique",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Photo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Path = table.Column<string>(type: "varchar(60)", unicode: false, maxLength: 60, nullable: false),
                    AntiqueId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Photo", x => x.Id);
                    table.ForeignKey(
                        name: "FK__Photo__AntiqueId__267ABA7A",
                        column: x => x.AntiqueId,
                        principalTable: "Antique",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BidHistory_AntiqueId",
                table: "BidHistory",
                column: "AntiqueId");

            migrationBuilder.CreateIndex(
                name: "IX_Photo_AntiqueId",
                table: "Photo",
                column: "AntiqueId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BidHistory");

            migrationBuilder.DropTable(
                name: "Photo");

            migrationBuilder.DropTable(
                name: "Antique");
        }
    }
}
