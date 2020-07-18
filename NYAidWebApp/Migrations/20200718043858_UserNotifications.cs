using Microsoft.EntityFrameworkCore.Migrations;

namespace NYAidWebApp.Migrations
{
    public partial class UserNotifications : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EmailNotificationsEnabled",
                table: "Users",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AlterColumn<string>(
                name: "RequestId",
                table: "Offers",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Offers_RequestId",
                table: "Offers",
                column: "RequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_Requests_RequestId",
                table: "Offers",
                column: "RequestId",
                principalTable: "Requests",
                principalColumn: "RequestId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offers_Requests_RequestId",
                table: "Offers");

            migrationBuilder.DropIndex(
                name: "IX_Offers_RequestId",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "EmailNotificationsEnabled",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "RequestId",
                table: "Offers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
