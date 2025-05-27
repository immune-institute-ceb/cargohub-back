// Objective: Implement the service to manage the user entity.

//* NestJS modules
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async archiveRuta(ruta: Ruta) {
    try {
      const rutaToArchive = await this.rutaModel.findById(ruta._id);

      if (rutaToArchive?.isDeleted === true)
        throw new BadRequestException('Ruta already archived');

      const rutaArchived = await this.rutaModel.findOneAndUpdate(
        { _id: ruta._id },
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      );

      if (!rutaArchived) throw new NotFoundException('Ruta not found');

      return { message: 'Ruta archived' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async restoreRuta(ruta: Ruta) {
    try {
      const rutaToRestore = await this.rutaModel.findById(ruta._id);

      if (rutaToRestore?.isDeleted === false)
        throw new BadRequestException('Ruta not archived');

      const rutaRestored = await this.rutaModel.findOneAndUpdate(
        { _id: ruta._id },
        { isDeleted: false, deletedAt: null },
        { new: true },
      );

      if (!rutaRestored) throw new NotFoundException('Ruta not found');

      return { message: 'Ruta restored' };
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
      if (!rutas) throw new NotFoundException('Rutas not found');
      return rutas;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
