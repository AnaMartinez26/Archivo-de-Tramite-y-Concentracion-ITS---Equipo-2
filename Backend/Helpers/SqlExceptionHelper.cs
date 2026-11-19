using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
namespace Backend.Helpers;
public static class SqlExceptionHelper
{
    public static bool EsClaveDuplicada(DbUpdateException ex) =>
        ex.InnerException is SqlException sqlEx && sqlEx.Number is 2601 or 2627;
}