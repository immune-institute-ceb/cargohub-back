// Objective: Implement the controller for the routes module

//* NestJS modules
import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* Decorators
import { Auth } from '@modules/auth/decorators/auth.decorator';
import { GetUser } from '@modules/auth/decorators';

//* Entities
import { Billing } from './entities/billing.entity';
import { User } from '@modules/users/entities/user.entity';

//* Services
import { BillingService } from './billing.service';

// * Interfaces
import { ValidRoles } from '@modules/auth/interfaces';
import { BillingStatus } from './interfaces/billing-status.interface';

@ApiTags('Billing')
@ApiNotFoundResponse({ description: 'Billing not found' })
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiCreatedResponse({ description: 'Billing deleted' })
  @ApiOperation({ summary: 'Delete a billing by Id' })
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    return this.billingService.deleteBilling(id);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiResponse({
    status: 200,
    description: 'All billings',
    type: [Billing],
  })
  @ApiOperation({ summary: 'Get all billings' })
  findAll() {
    return this.billingService.findAllBillings();
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiResponse({
    status: 200,
    description: 'Billing found',
    type: Billing,
  })
  @ApiOperation({ summary: 'Get billing by ID' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.billingService.findBillingById(id);
  }

  @Get('status/:status')
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiResponse({
    status: 200,
    description: 'Billings by status',
    type: [Billing],
  })
  @ApiOperation({ summary: 'Get billings by status' })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'Status of the billings to filter by',
    enum: BillingStatus,
  })
  @ApiNotFoundResponse({ description: 'No billings found with status :status' })
  findByStatus(@Query('status') status: string) {
    return this.billingService.findBillingsByStatus(status);
  }

  @Get('client/:clientId')
  @Auth(ValidRoles.admin, ValidRoles.adminManager, ValidRoles.client)
  @ApiResponse({
    status: 200,
    description: 'Billings by client ID',
    type: [Billing],
  })
  @ApiOperation({ summary: 'Get billings by client ID' })
  @ApiQuery({
    name: 'clientId',
    required: true,
    description: 'Client ID to filter billings by',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'No billings found for the provided client ID',
  })
  findByClientId(@Query('clientId', ParseMongoIdPipe) clientId: string) {
    return this.billingService.findBillingsByClientId(clientId);
  }

  @Patch('status/:id')
  @Auth(ValidRoles.admin)
  @ApiResponse({
    status: 200,
    description: 'Billing status updated',
    type: Billing,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        { example: { message: 'Billing already has status: :status' } },
        { example: { message: 'Billing with status X cannot be updated' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Update billing status' })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'New status for the billing',
    enum: BillingStatus,
  })
  async updateStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query('status') status: BillingStatus,
    @GetUser() user: any,
  ) {
    return this.billingService.updateBillingStatus(id, status, user as User);
  }
}
