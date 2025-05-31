// Objective: Implement the controller for the dashboard module to manage dashboard-related endpoints.

// * NestJS Modules
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

//* Decorators
import { Auth } from '@modules/auth/decorators';

// * Services
import { DashboardService } from './dashboard.service';

// * Interfaces
import { ValidRoles } from '@modules/auth/interfaces';
import { DashboardResponseDto } from './dto/response.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('dashboard/summary')
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get dashboard summary',
    description:
      'Returns a summary of the dashboard including KPIs and request statistics.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard summary retrieved successfully.',
    type: DashboardResponseDto,
  })
  async getDashboardSummary() {
    return this.dashboardService.getDashboardSummary();
  }
}
