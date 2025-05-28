// Objective: Implement the service to manage the user entity.

//* NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//* External modules
import { Model } from 'mongoose';

//* DTOs
import { RegisterRutaDto } from './dto/register-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';

//* Entities
import { Ruta } from './entities/rutas.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';

@Injectable()
export class RutasService {
  constructor(
    @InjectModel(Ruta.name)
    private readonly rutaModel: Model<Ruta>,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async create(registerRutaDto: RegisterRutaDto) {
    try {
      const rutaCreated = await this.rutaModel.create(registerRutaDto);
      return rutaCreated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async update(ruta: Ruta, updateRutaDto: UpdateRutaDto) {
    try {
      const { ...update } = updateRutaDto;

      const rutaUpdated = await this.rutaModel.findOneAndUpdate(
        { _id: ruta._id },
        update,
        {
          new: true,
        },
      );

      if (!rutaUpdated) throw new NotFoundException('Ruta not found');

      return {
        message: 'Ruta updated',
        rutaUpdated,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async deleteRuta(ruta: Ruta) {
    try {
      await this.rutaModel.findOneAndDelete({ _id: ruta._id });
      return { message: 'Ruta deleted' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAllRutas() {
    try {
      const rutas = await this.rutaModel.find();
      if (!rutas) throw new NotFoundException('Rutas not found');
      return rutas;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findRutaById(id: string) {
    try {
      const ruta = await this.rutaModel.findById(id);

      if (!ruta) throw new NotFoundException('Ruta not found');

      return ruta;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findRutasByType(type: string) {
    try {
      const rutas = await this.rutaModel.find({ type });
      if (!rutas)
        throw new NotFoundException(`No rutas found for type: ${type}`);
      return rutas;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
