using Microsoft.EntityFrameworkCore;
using VehiculosREST.Data;

var builder = WebApplication.CreateBuilder(args);

var cultureInfo = new System.Globalization.CultureInfo("en-US");

System.Globalization.CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
System.Globalization.CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

// ==============================
// CONTROLADORES
// ==============================
builder.Services.AddControllers();

// ==============================
// BASE DE DATOS
// ==============================
builder.Services.AddDbContext<VehiculosDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("VehiculosConnection")
    ));

// ==============================
// CORS PARA ANGULAR
// ==============================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ==============================
// OPEN API
// ==============================
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// ==============================
// CORS
// ==============================
app.UseCors("AngularPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();