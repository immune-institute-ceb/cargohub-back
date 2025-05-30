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
import { RegisterUserDto, UpdateUserDto } from '@modules/auth/dto';

//* Entities
import { User } from './entities/user.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';

//* Modules
import { CarriersService } from '@modules/carriers/carriers.service';
import { ClientsService } from '@modules/clients/clients.service';
import { ValidRoles } from '@modules/auth/interfaces';
import { AuditLogsService } from '@modules/audit-logs/audit-logs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly exceptionsService: ExceptionsService,
    private readonly clientsService: ClientsService,
    private readonly carriersService: CarriersService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(registerUserDto: RegisterUserDto) {
    try {
      const { roles, clientData, carrierData, ...rest } = registerUserDto;

      const userData: Partial<User> = {
        ...rest,
        roles: Array.isArray(roles) ? roles : [roles],
      };

      const userExists = await this.userModel.findOne({
        email: userData.email,
      });
      if (userExists)
        throw new BadRequestException('User already exists in the database');
      // Validar que no se cra un cliente o un carrier que ya existe
      if (
        (roles.includes(ValidRoles.client) && clientData) ||
        (roles.includes(ValidRoles.carrier) && carrierData)
      ) {
        const existingClient = clientData?.companyCIF
          ? await this.clientsService.findDuplicateClient(
              clientData.companyCIF,
              clientData.companyName,
              clientData.companyAddress,
            )
          : undefined;
        const existingCarrier = carrierData?.dni
          ? await this.carriersService.finByDni(carrierData.dni)
          : undefined;

        if (existingClient || existingCarrier) {
          throw new BadRequestException(
            'Duplicate client or carrier data found',
          );
        }
      }
      // 1. Crear usuario base
      const createdUser = await this.userModel.create(userData);
      // 2. Según rol, crear entidad relacionada
      if (roles.includes(ValidRoles.client) && clientData) {
        const client = await this.clientsService.create(
          {
            ...clientData,
          },
          createdUser._id,
        );
        createdUser.clientId = client._id;
      }

      if (roles.includes(ValidRoles.carrier) && carrierData) {
        const carrier = await this.carriersService.create(
          {
            ...carrierData,
          },
          createdUser._id,
        );
        createdUser.carrierId = carrier._id;
      }

      // 3. Guardar referencias en el usuario
      return createdUser.save();
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    try {
      if (user.roles.includes(ValidRoles.client) && updateUserDto.carrierData) {
        throw new BadRequestException(
          'Carrier data is not allowed for users with client role',
        );
      } else if (
        user.roles.includes(ValidRoles.carrier) &&
        updateUserDto.clientData
      ) {
        throw new BadRequestException(
          'Client data is not allowed for users with carrier role',
        );
      }
      const { ...update } = updateUserDto;
      const userUpdated = await this.userModel
        .findOneAndUpdate({ _id: user._id }, update, {
          new: true,
        })
        .populate('clientId')
        .populate('carrierId')
        .exec();

      if (!userUpdated) throw new NotFoundException('User not found');
      if (userUpdated.roles.includes(ValidRoles.client)) {
        if (!userUpdated.clientId) {
          throw new NotFoundException('Client ID not found for user');
        }
        if (update.clientData) {
          await this.clientsService.update(
            userUpdated.clientId._id.toString(),
            update.clientData,
          );
        }
      } else if (userUpdated.roles.includes(ValidRoles.carrier)) {
        if (!userUpdated.carrierId) {
          throw new NotFoundException('Carrier ID not found for user');
        }
        if (update.carrierData) {
          await this.carriersService.update(
            userUpdated.carrierId._id.toString(),
            update.carrierData,
          );
        }
      }

      return {
        message: 'User updated',
        userUpdated: await this.findUserById(userUpdated._id.toString()),
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findUserWithPassword(email: string) {
    try {
      return await this.userModel
        .findOne({ email })
        .select('+password')
        .populate('clientId')
        .populate('carrierId')
        .exec();
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findUserById(_id: string) {
    try {
      return await this.userModel
        .findById(_id)
        .populate('clientId')
        .populate('carrierId')
        .exec();
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAndUpdatePassword(_id: string, password: string) {
    try {
      return await this.userModel.findOneAndUpdate(
        { _id },
        { password, emailVerified: true },
        { new: true },
      );
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async deleteUser(user: User) {
    try {
      if (user.roles.includes(ValidRoles.client)) {
        if (!user.clientId) {
          throw new NotFoundException('Client ID not found for user');
        }
        await this.clientsService.remove(user.clientId._id.toString());
      } else if (user.roles.includes(ValidRoles.carrier)) {
        if (!user.carrierId) {
          throw new NotFoundException('Carrier ID not found for user');
        }
        await this.carriersService.remove(user.carrierId._id.toString());
      }
      await this.userModel.findOneAndDelete({ _id: user._id });
      return { message: 'User deleted' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findUserByEmail(email: string) {
    return await this.userModel
      .findOne({ email })
      .populate('clientId')
      .populate('carrierId')
      .exec();
  }

  async getUser(user: User) {
    const foundUser = await this.findUserById(user._id.toString());
    if (!foundUser) throw new NotFoundException('User not found');
    return foundUser;
  }
}
