// Objective: Implement the controller for the routes module

//* NestJS modules
import {
  Controller,
  Body,
  Patch,
  Delete,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* DTOs
import { RegisterBillingDto } from './dto/register-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

//* Entities
import { Billing } from './entities/billing.entity';

//* Services
import { BillingService } from './billing.service';

@ApiTags('Billing')
@ApiBearerAuth()
@ApiNotFoundResponse({ description: 'Billing not found' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Billing created successfully',
    type: Billing,
  })
  @ApiOperation({ summary: 'Create a new billing' })
  create(@Body() registerBillingDto: RegisterBillingDto) {
    return this.billingService.create(registerBillingDto);
  }

  @Patch('update-billing/:id')
  @ApiResponse({
    status: 200,
    description: 'Billing updated',
    type: Billing,
  })
  @ApiOperation({ summary: 'Update an existing billing by Id' })
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateBillingDto: UpdateBillingDto,
  ) {
    const billing = await this.billingService.findBillingById(id);
    return this.billingService.update(billing, updateBillingDto);
  }

  @Delete('delete-billing/:id')
  @ApiCreatedResponse({ description: 'Billing deleted' })
  @ApiOperation({ summary: 'Delete a billing by Id' })
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    const billing = await this.billingService.findBillingById(id);
    return this.billingService.deleteBilling(billing);
  }

  @Get()
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
  @ApiResponse({
    status: 200,
    description: 'Billings by status',
    type: [Billing],
  })
  @ApiOperation({ summary: 'Get billings by status' })
  @ApiNotFoundResponse({ description: 'No billings found with status :status' })
  findByStatus(@Param('status') status: string) {
    return this.billingService.findBillingsByStatus(status);
  }
}
