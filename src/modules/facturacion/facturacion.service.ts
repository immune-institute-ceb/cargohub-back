// Objective: Implement the service to manage the user entity.

//* NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//* External modules
import { Model } from 'mongoose';

//* DTOs
import { RegisterFacturacionDto } from './dto/register-facturacion.dto';
import { UpdateFacturacionDto } from './dto/update-facturacion.dto';

//* Entities
import { Facturacion } from './entities/facturacion.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';

@Injectable()
export class FacturacionService {
  constructor(
    @InjectModel(Facturacion.name)
    private readonly facturacionModel: Model<Facturacion>,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async create(registerFacturacionDto: RegisterFacturacionDto) {
    try {
      const facturacionCreated = await this.facturacionModel.create(
        registerFacturacionDto,
      );
      return facturacionCreated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async update(
    facturacion: Facturacion,
    updateFacturacionDto: UpdateFacturacionDto,
  ) {
    try {
      const { ...update } = updateFacturacionDto;

      const facturacionUpdated = await this.facturacionModel.findOneAndUpdate(
        { _id: facturacion._id },
        update,
        {
          new: true,
        },
      );

      if (!facturacionUpdated)
        throw new NotFoundException('Facturación not found');

      return facturacionUpdated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async deleteFactura(facturacion: Facturacion) {
    try {
      await this.facturacionModel.findOneAndDelete({ _id: facturacion._id });
      return { message: 'Factura deleted' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAllFacturas() {
    try {
      const facturaciones = await this.facturacionModel.find();
      return facturaciones;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findFacturaById(id: string) {
    try {
      const facturacion = await this.facturacionModel.findById(id);
      if (!facturacion) throw new NotFoundException('Facturación not found');
      return facturacion;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findFacturasByStatus(estado: string) {
    try {
      const facturaciones = await this.facturacionModel.find({ estado });
      if (facturaciones.length === 0) {
        throw new NotFoundException(`No facturas found with status: ${estado}`);
      }
      return facturaciones;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
