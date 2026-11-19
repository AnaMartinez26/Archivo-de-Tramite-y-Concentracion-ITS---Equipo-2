using System.Security.Claims;
using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Digitalizacion;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/digitalizacion")]
[Authorize]
public class DigitalizacionController : ControllerBase
{
    private readonly IDocumentoService _docs;
    private const string RolesLecturaYRegistro = "Administrador,Encargada de Archivo,Trabajador RRHH";
    private const string RolesGestion = "Administrador,Encargada de Archivo";
    public DigitalizacionController(IDocumentoService docs) => _docs = docs;

    // Id del usuario autenticado (0 si el token no trae el claim)
    private int UsuarioId =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

    // GET api/digitalizacion
    [HttpGet]
    public async Task<IActionResult> ObtenerTodos()
    {
        var lista = await _docs.ObtenerTodosAsync();
        return Ok(ApiResponse<object>.Ok(lista));
    }

    // GET api/digitalizacion/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObtenerPorId(int id)
    {
        var r = await _docs.ObtenerPorIdAsync(id);
        return r.Exito ? Ok(ApiResponse<object>.Ok(r.Data!)) 
                       : StatusCode(r.StatusCode, ApiResponse<object>.Fail(r.Mensaje));
    }

    // POST api/digitalizacion
    [HttpPost]
    [Authorize(Roles = RolesLecturaYRegistro)]
    public async Task<IActionResult> Crear([FromBody] CrearDocumentoDto dto)
    {
        if (UsuarioId == 0) return Unauthorized(ApiResponse<object>.Fail("Token inválido."));
        var r = await _docs.CrearAsync(dto, UsuarioId);
        return r.Exito ? StatusCode(r.StatusCode, ApiResponse<object>.Ok(r.Data!, r.Mensaje))
                       : StatusCode(r.StatusCode, ApiResponse<object>.Fail(r.Mensaje));
    }

    // PUT api/digitalizacion/5
    [HttpPut("{id:int}")]
    [Authorize(Roles = RolesGestion)]
    public async Task<IActionResult> Actualizar(int id, [FromBody] ActualizarDocumentoDto dto)
    {
        var r = await _docs.ActualizarAsync(id, dto);
        return r.Exito ? Ok(ApiResponse<object>.Ok(r.Data!))
                       : StatusCode(r.StatusCode, ApiResponse<object>.Fail(r.Mensaje));
    }

    // POST api/digitalizacion/5/archivo  (multipart/form-data)
    [HttpPost("{id:int}/archivo")]
    [RequestSizeLimit(20 * 1024 * 1024)]   // 20 MB
    [Authorize(Roles = RolesLecturaYRegistro)]
    public async Task<IActionResult> SubirArchivo(int id, IFormFile archivo)
    {
        if (UsuarioId == 0) return Unauthorized(ApiResponse<object>.Fail("Token inválido."));
        if (archivo is null || archivo.Length == 0)
            return BadRequest(ApiResponse<object>.Fail("No se recibió ningún archivo."));

        await using var stream = archivo.OpenReadStream();
        var r = await _docs.SubirArchivoAsync(id, stream, archivo.FileName, UsuarioId);
        return r.Exito ? Ok(ApiResponse<object>.Ok(r.Data!, r.Mensaje))
                       : StatusCode(r.StatusCode, ApiResponse<object>.Fail(r.Mensaje));
    }

    // GET api/digitalizacion/5/archivo  (descarga el PDF)
    [HttpGet("{id:int}/archivo")]
    public async Task<IActionResult> DescargarArchivo(int id)
    {
        var r = await _docs.ObtenerRutaArchivoAsync(id);
        if (!r.Exito)
            return StatusCode(r.StatusCode, ApiResponse<object>.Fail(r.Mensaje));

        return PhysicalFile(r.Data!, "application/pdf", Path.GetFileName(r.Data!), enableRangeProcessing: true);
    }

    // DELETE api/digitalizacion/5
    [HttpDelete("{id:int}")]
    [Authorize(Roles = RolesGestion)]
    public async Task<IActionResult> Eliminar(int id)
    {
        var r = await _docs.EliminarAsync(id);
        return r.Exito ? Ok(ApiResponse<object>.Ok(true, r.Mensaje))
                       : StatusCode(r.StatusCode, ApiResponse<object>.Fail(r.Mensaje));
    }
}