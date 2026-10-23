using Backend.Models.DTOs.Auth;
using Backend.Models.DTOs.Common;

namespace Backend.Services.Interfaces;

public interface IAuthService
{
    Task<ServiceResult<LoginResponseDto>> LoginAsync(LoginRequestDto dto);
}
