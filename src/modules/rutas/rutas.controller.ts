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
} from '@nestjs/swagger';

//* External modules
// import { Express } from 'express';

//* DTOs
import { RegisterRutaDto, UpdateRutaDto } from '@modules/rutas/dto';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* Services
import { RutasService } from './rutas.service';

//* Entities
import { Ruta } from '@modules/rutas/entities/rutas.entity';

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
  create(@Body() registerRutaDto: RegisterRutaDto) {
    return this.rutasService.create(registerRutaDto);
  }

  @Patch(':id')
  @ApiCreatedResponse({ description: 'Ruta updated', type: Ruta })
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateRutaDto: UpdateRutaDto,
  ) {
    const ruta = await this.rutasService.findRutaById(id);
    return this.rutasService.update(ruta, updateRutaDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ description: 'Ruta deleted' })
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    const ruta = await this.rutasService.findRutaById(id);
    return this.rutasService.deleteRuta(ruta);
  }

  @Patch('archive/:id')
  @ApiCreatedResponse({ description: 'Ruta archived' })
  async archive(@Param('id', ParseMongoIdPipe) id: string) {
    const ruta = await this.rutasService.findRutaById(id);
    return this.rutasService.archiveRuta(ruta);
  }

  @Patch('restore/:id')
  @ApiCreatedResponse({ description: 'Ruta restored' })
  async restore(@Param('id', ParseMongoIdPipe) id: string) {
    const ruta = await this.rutasService.findRutaById(id);
    return this.rutasService.restoreRuta(ruta);
  }

  @Get()
  @ApiCreatedResponse({ description: 'All rutas', type: [Ruta] })
  findAll() {
    return this.rutasService.findAllRutas();
  }

  @Get(':id')
  @ApiCreatedResponse({ description: 'Ruta found', type: Ruta })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rutasService.findRutaById(id);
  }

  @Get('type/:type')
  @ApiCreatedResponse({ description: 'Rutas by type', type: [Ruta] })
  findByType(@Param('type') type: string) {
    return this.rutasService.findRutasByType(type.toLowerCase().trim());
  }
}
