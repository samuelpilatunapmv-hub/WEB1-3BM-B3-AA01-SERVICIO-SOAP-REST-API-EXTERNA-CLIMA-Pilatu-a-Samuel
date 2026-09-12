using Microsoft.EntityFrameworkCore;
using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using VehiculosSOAPDB.Data;
using VehiculosSOAPDB.Services;

var builder = WebApplication.CreateBuilder(args);

// ================================
// BASE DE DATOS
// ================================
builder.Services.AddDbContext<VehiculosDBContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("VehiculosConnection")
    )
);

builder.Services.AddScoped<VehiculoService>();

// ================================
// CORS PARA ANGULAR
// ================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// ================================
// CORE WCF / SOAP
// ================================
builder.Services
    .AddServiceModelServices()
    .AddServiceModelMetadata();

builder.Services.AddSingleton<IServiceBehavior,
    UseRequestHeadersForMetadataAddressBehavior>();

builder.WebHost.ConfigureKestrel(options =>
{
    options.AllowSynchronousIO = true;
});

var app = builder.Build();

// IMPORTANTE: antes del servicio SOAP
app.UseCors("AngularPolicy");

// ================================
// ENDPOINT SOAP
// ================================
app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder
        .AddService<VehiculoService>(serviceOptions =>
        {
            serviceOptions.DebugBehavior.IncludeExceptionDetailInFaults = true;
        })
        .AddServiceEndpoint<VehiculoService, IVehiculoService>(
            new BasicHttpBinding(),
            "/VehiculoService.svc"
        );
});

// ================================
// METADATA / WSDL
// ================================
var metadataBehavior =
    app.Services.GetRequiredService<ServiceMetadataBehavior>();

metadataBehavior.HttpGetEnabled = true;

app.Run();