// Objective: Implement the service to manage the user entity.

//* NestJS modules
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//* External modules
import { Model, ObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';

//* DTOs
import {
  ChangePasswordDto,
  RegisterUserDto,
  RestoreUserDto,
  UpdateUserDto,
} from '@modules/auth/dto';

//* Entities
import { User } from './entities/user.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';

//* Modules
import { CarriersService } from '@modules/carriers/carriers.service';
import { ClientsService } from '@modules/clients/clients.service';
import { ValidRoles } from '@modules/auth/interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly exceptionsService: ExceptionsService,
    private readonly clientsService: ClientsService,
    private readonly carriersService: CarriersService,
  ) {}

  async create(registerUserDto: RegisterUserDto) {
    try {
      const { roles, clientData, carrierData, ...rest } = registerUserDto;

      const userData: Partial<User> = {
        ...rest,
        roles: Array.isArray(roles) ? roles : [roles],
        isActive: true,
        isDeleted: false,
      };

      const userExists = await this.userModel.findOne({
        email: userData.email,
      });
      if (userExists)
        throw new BadRequestException('User already exists in the database');
      // 1. Crear usuario base
      const createdUser = await this.userModel.create(userData);
      // 2. Según rol, crear entidad relacionada
      if (roles.includes(ValidRoles.client) && clientData) {
        const client = await this.clientsService.create(
          {
            ...clientData,
          },
          createdUser._id as unknown as ObjectId,
        );
        createdUser.clientId = client._id;
      }

      if (roles.includes(ValidRoles.carrier) && carrierData) {
        const carrier = await this.carriersService.create(
          {
            ...carrierData,
          },
          createdUser._id as unknown as ObjectId,
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
      const { ...update } = updateUserDto;

      const userUpdated = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        update,
        {
          new: true,
        },
      );

      if (!userUpdated) throw new NotFoundException('User not found');

      return {
        message: 'User updated',
        userUpdated,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async updatePassword(changePasswordDto: ChangePasswordDto, user: User) {
    try {
      const { password, passwordConfirmed } = changePasswordDto;

      if (password !== passwordConfirmed)
        throw new BadRequestException('Passwords do not match');

      const passwordHashed = await bcrypt.hash(password, 10);
      const userUpdated = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        { password: passwordHashed },
        { new: true },
      );

      if (!userUpdated) throw new NotFoundException('User not found');

      return {
        message: 'Password updated',
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
      await this.userModel.findOneAndDelete({ _id: user._id });
      return { message: 'User deleted' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async archiveUser(user: User) {
    try {
      const userToDelete = await this.findUserByEmail(user.email);

      if (userToDelete?.isDeleted === true)
        throw new BadRequestException('User already archived');

      const userArchived = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      );

      if (!userArchived) throw new NotFoundException('User not found');

      return { message: 'User archived' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async restoreUser(restoreUserDto: RestoreUserDto) {
    try {
      const { email } = restoreUserDto;
      const user = await this.findUserByEmail(email);

      if (user?.isDeleted === false)
        throw new BadRequestException('User not archived');

      const userRestored = await this.userModel.findOneAndUpdate(
        { email },
        { isDeleted: false, deletedAt: null },
        { new: true },
      );

      if (!userRestored) throw new NotFoundException('User not found');

      return { message: 'User restored' };
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
}
