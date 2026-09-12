using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehiculosREST.Data;
using VehiculosREST.Models;

namespace VehiculosREST.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MantenimientoController : ControllerBase
{
    private readonly VehiculosDbContext _context;

    public MantenimientoController(VehiculosDbContext context)
    {
        _context = context;
    }

    // GET: api/mantenimiento
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Mantenimiento>>> ObtenerMantenimientos()
    {
        var mantenimientos = await _context.Mantenimientos
            .AsNoTracking()
            .Include(m => m.Vehiculo)
            .OrderBy(m => m.IdMantenimiento)
            .ToListAsync();

        return Ok(mantenimientos);
    }

    // GET: api/mantenimiento/3
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Mantenimiento>> ObtenerMantenimiento(int id)
    {
        var mantenimiento = await _context.Mantenimientos
            .AsNoTracking()
            .Include(m => m.Vehiculo)
            .FirstOrDefaultAsync(m => m.IdMantenimiento == id);

        if (mantenimiento == null)
        {
            return NotFound(new
            {
                mensaje = "Mantenimiento no encontrado"
            });
        }

        return Ok(mantenimiento);
    }

    // GET: api/mantenimiento/vehiculo/2
    [HttpGet("vehiculo/{idVehiculo:int}")]
    public async Task<ActionResult<IEnumerable<Mantenimiento>>> ObtenerMantenimientosPorVehiculo(
        int idVehiculo)
    {
        var vehiculoExistente = await _context.Vehiculos
            .AsNoTracking()
            .AnyAsync(v => v.IdVehiculo == idVehiculo);

        if (!vehiculoExistente)
        {
            return NotFound(new
            {
                mensaje = "Vehículo no encontrado"
            });
        }

        var mantenimientos = await _context.Mantenimientos
            .AsNoTracking()
            .Include(m => m.Vehiculo)
            .Where(m => m.IdVehiculo == idVehiculo)
            .OrderBy(m => m.IdMantenimiento)
            .ToListAsync();

        return Ok(mantenimientos);
    }

    // POST: api/mantenimiento
    [HttpPost]
    public async Task<ActionResult<Mantenimiento>> AgregarMantenimiento(
        [FromBody] Mantenimiento mantenimiento)
    {
        var vehiculoExistente = await _context.Vehiculos
            .AsNoTracking()
            .AnyAsync(v => v.IdVehiculo == mantenimiento.IdVehiculo);

        if (!vehiculoExistente)
        {
            return NotFound(new
            {
                mensaje = "Vehículo no encontrado"
            });
        }

        mantenimiento.IdMantenimiento = 0;

        _context.Mantenimientos.Add(mantenimiento);

        await _context.SaveChangesAsync();

        return Ok(mantenimiento);
    }

    // PUT: api/mantenimiento/3
    [HttpPut("{id:int}")]
    public async Task<ActionResult<Mantenimiento>> ActualizarMantenimiento(
        int id,
        Mantenimiento mantenimiento)
    {
        var mantenimientoActual = await _context.Mantenimientos
            .FirstOrDefaultAsync(m => m.IdMantenimiento == id);

        if (mantenimientoActual == null)
        {
            return NotFound(new
            {
                mensaje = "Mantenimiento no encontrado"
            });
        }

        var vehiculoExistente = await _context.Vehiculos
            .AsNoTracking()
            .AnyAsync(v => v.IdVehiculo == mantenimiento.IdVehiculo);

        if (!vehiculoExistente)
        {
            return NotFound(new
            {
                mensaje = "Vehículo no encontrado"
            });
        }

        mantenimientoActual.Fecha = mantenimiento.Fecha;
        mantenimientoActual.Tipo = mantenimiento.Tipo;
        mantenimientoActual.Descripcion = mantenimiento.Descripcion;
        mantenimientoActual.Costo = mantenimiento.Costo;
        mantenimientoActual.Kilometraje = mantenimiento.Kilometraje;
        mantenimientoActual.Estado = mantenimiento.Estado;
        mantenimientoActual.IdVehiculo = mantenimiento.IdVehiculo;

        await _context.SaveChangesAsync();

        return Ok(mantenimientoActual);
    }

    // DELETE: api/mantenimiento/3
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> EliminarMantenimiento(int id)
    {
        var mantenimiento = await _context.Mantenimientos
            .FindAsync(id);

        if (mantenimiento == null)
        {
            return NotFound(new
            {
                mensaje = "Mantenimiento no encontrado"
            });
        }

        _context.Mantenimientos.Remove(mantenimiento);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}