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
import { CarriersService } from '@modules/carriers/carriers.service';
import { ClientsService } from '@modules/clients/clients.service';
import { AuditLogsService } from '@modules/audit-logs/audit-logs.service';

// * Interfaces
import { ValidRoles } from '@modules/auth/interfaces';
import { AuditLogLevel } from '@modules/audit-logs/interfaces/log-level.interface';
import { AuditLogContext } from '@modules/audit-logs/interfaces/context-log.interface';

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
          ? await this.clientsService.findByCIF(clientData.companyCIF)
          : undefined;
        const existingCarrier = carrierData?.dni
          ? await this.carriersService.findByDniOrLicense(
              carrierData.dni,
              carrierData.licenseNumber,
            )
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
      await this.auditLogsService.create({
        level: AuditLogLevel.info,
        context: AuditLogContext.userService,
        message: `User created successfully`,
        meta: {
          userId: createdUser._id.toString(),
        },
      });
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
      if (user.roles.includes(ValidRoles.client)) {
        if (!user.clientId) {
          throw new NotFoundException('Client ID not found for user');
        }
        if (update.clientData) {
          await this.clientsService.update(
            user.clientId._id.toString(),
            update.clientData,
          );
        }
      } else if (user.roles.includes(ValidRoles.carrier)) {
        if (!user.carrierId) {
          throw new NotFoundException('Carrier ID not found for user');
        }
        if (update.carrierData) {
          await this.carriersService.update(
            user.carrierId._id.toString(),
            update.carrierData,
          );
        }
      }
      const userUpdated = await this.userModel
        .findOneAndUpdate({ _id: user._id }, update, {
          new: true,
        })
        .populate('clientId')
        .populate('carrierId')
        .exec();

      if (!userUpdated) throw new NotFoundException('User not found');
      await this.auditLogsService.create({
        level: AuditLogLevel.info,
        context: AuditLogContext.userService,
        message: `User updated successfully`,
        meta: {
          userId: userUpdated._id.toString(),
        },
      });
      return {
        message: 'User updated',
        userUpdated: userUpdated,
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
        { password },
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
        await this.carriersService.remove(user.carrierId._id.toString(), user);
      }
      await this.userModel.findOneAndDelete({ _id: user._id });
      await this.auditLogsService.create({
        level: AuditLogLevel.warn,
        context: AuditLogContext.userService,
        message: `User deleted successfully`,
        meta: {
          userId: user._id.toString(),
        },
      });
      return { message: 'User deleted' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async deleteUserByAdmin(_id: string) {
    try {
      const user = await this.findUserById(_id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.deleteUser(user);
      await this.auditLogsService.create({
        level: AuditLogLevel.warn,
        context: AuditLogContext.userService,
        message: `User deleted by admin`,
        meta: {
          userId: user._id.toString(),
        },
      });
      return { message: 'User deleted by admin' };
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

  async getAdminUsers() {
    try {
      const users = await this.userModel
        .find({ roles: ValidRoles.adminManager })
        .populate('clientId')
        .populate('carrierId')
        .exec();
      if (!users || users.length === 0) {
        throw new NotFoundException('No admin users found');
      }
      return users;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
