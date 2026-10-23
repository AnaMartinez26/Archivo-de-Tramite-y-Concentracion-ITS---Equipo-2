using Backend.Data.Seed;
using Backend.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddAplicacion(builder.Configuration);        // DbContext, repositorios, servicios
builder.Services.AddAutenticacionJwt(builder.Configuration);  // JWT
builder.Services.AddCorsFrontend(builder.Configuration);      // CORS para React

var app = builder.Build();

// Roles base y administrador inicial
await DbSeeder.SeedAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
