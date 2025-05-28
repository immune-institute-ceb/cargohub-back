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
  ApiOperation,
} from '@nestjs/swagger';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* DTOs
import { RegisterRutaDto } from './dto/register-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';

//* Entities
import { Ruta } from '@modules/rutas/entities/rutas.entity';

//* Services
import { RutasService } from './rutas.service';

@ApiTags('Rutas')
@ApiBearerAuth()
@ApiNotFoundResponse({ description: 'Ruta not found' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Ruta created', type: Ruta })
  @ApiOperation({ summary: 'Create a new ruta' })
  create(@Body() registerRutaDto: RegisterRutaDto) {
    return this.rutasService.create(registerRutaDto);
  }

  @Patch(':id')
  @ApiCreatedResponse({ description: 'Ruta updated', type: Ruta })
  @ApiOperation({ summary: 'Update an existing ruta' })
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateRutaDto: UpdateRutaDto,
  ) {
    const ruta = await this.rutasService.findRutaById(id);
    return this.rutasService.update(ruta, updateRutaDto);
  }

  @Delete('delete-route/:id')
  @ApiCreatedResponse({ description: 'Ruta deleted' })
  @ApiOperation({ summary: 'Delete a ruta by Id' })
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    const ruta = await this.rutasService.findRutaById(id);
    return this.rutasService.deleteRuta(ruta);
  }

  @Get()
  @ApiCreatedResponse({ description: 'All rutas', type: [Ruta] })
  @ApiOperation({ summary: 'Get all rutas' })
  findAll() {
    return this.rutasService.findAllRutas();
  }

  @Get(':id')
  @ApiCreatedResponse({ description: 'Ruta found', type: Ruta })
  @ApiOperation({ summary: 'Get ruta by ID' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rutasService.findRutaById(id);
  }

  @Get('type/:type')
  @ApiCreatedResponse({ description: 'Rutas by type', type: [Ruta] })
  @ApiOperation({ summary: 'Get rutas by type' })
  @ApiNotFoundResponse({ description: 'No rutas found for type :type' })
  findByType(@Param('type') type: string) {
    return this.rutasService.findRutasByType(type.toLowerCase().trim());
  }
}
