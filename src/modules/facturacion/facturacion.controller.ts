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
} from '@nestjs/swagger';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* DTOs
import { RegisterFacturacionDto } from './dto/register-facturacion.dto';
import { UpdateFacturacionDto } from './dto/update-facturacion.dto';

//* Entities
import { Facturacion } from './entities/facturacion.entity';

//* Services
import { FacturacionService } from './facturacion.service';

@ApiTags('Facturacion')
@ApiBearerAuth()
@ApiNotFoundResponse({ description: 'Facturación not found' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('facturacion')
export class FacturacionController {
  constructor(private readonly facturacionService: FacturacionService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Facturación created successfully',
    type: Facturacion,
  })
  create(@Body() registerFacturacionDto: RegisterFacturacionDto) {
    return this.facturacionService.create(registerFacturacionDto);
  }

  @Patch('update-factura/:id')
  @ApiResponse({
    status: 200,
    description: 'Factura updated',
    type: Facturacion,
  })
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateFacturacionDto: UpdateFacturacionDto,
  ) {
    const facturacion = await this.facturacionService.findFacturaById(id);
    return this.facturacionService.update(facturacion, updateFacturacionDto);
  }

  @Delete('delete-factura/:id')
  @ApiCreatedResponse({ description: 'Factura deleted' })
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    const facturacion = await this.facturacionService.findFacturaById(id);
    return this.facturacionService.deleteFactura(facturacion);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All facturas',
    type: [Facturacion],
  })
  findAll() {
    return this.facturacionService.findAllFacturas();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Factura found',
    type: Facturacion,
  })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.facturacionService.findFacturaById(id);
  }

  @Get('status/:status')
  @ApiResponse({
    status: 200,
    description: 'Facturas by status',
    type: [Facturacion],
  })
  findByStatus(@Param('status') status: string) {
    return this.facturacionService.findFacturasByStatus(status);
  }
}
