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
import * as bcrypt from 'bcrypt';

//* DTOs
import {
  ChangePasswordDto,
  RegisterUserDto,
  RestoreUserDto,
  UpdateUserDto,
} from '@modules/auth/dto';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';

//* Entities
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async create(registerUserDto: RegisterUserDto) {
    try {
      const userCreated = await this.userModel.create(registerUserDto);
      return userCreated;
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
      return await this.userModel.findOne({ email }).select('+password');
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findUserById(_id: string) {
    try {
      return await this.userModel.findById(_id);
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

  async suscribeNewsLetter(user: User) {
    try {
      const userUpdated = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        { suscribed: true },
        { new: true },
      );

      if (!userUpdated) throw new NotFoundException('User not found');

      return {
        message: 'User subscribed to newsletter',
        userUpdated,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async unsuscribeNewsLetter(user: User) {
    try {
      const userUpdated = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        { suscribed: false },
        { new: true },
      );

      if (!userUpdated) throw new NotFoundException('User not found');

      return {
        message: 'User unsubscribed to newsletter',
        userUpdated,
      };
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

  // async uploadCSV(user: User, file: Express.Multer.File) {
  //   try {
  //     const userToUpdate = await this.userModel.findOne({ _id: user._id });
  //     if (!userToUpdate) throw new NotFoundException('User not found');

  //     const data = new FormData();
  //     const blob = new Blob([file.buffer], { type: file.mimetype });
  //     data.append('file', blob, file.originalname);

  //     const uploadRequest = await fetch(
  //       'https://api.pinata.cloud/pinning/pinFileToIPFS',
  //       {
  //         method: 'POST',
  //         headers: {
  //           pinata_api_key: this.configService.get('pinataApiKey') || '',
  //           pinata_secret_api_key: this.configService.get('pinataSecret') || '',
  //         },
  //         body: data,
  //       },
  //     );

  //     const response = await uploadRequest.json();
  //     const ipfsHash = response.IpfsHash;

  //     if (!ipfsHash)
  //       throw new BadRequestException('Error uploading file to IPFS');

  //     const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

  //     let files = userToUpdate?.csvfile;

  //     if (files) {
  //       files.push(url);
  //     } else {
  //       files = [url];
  //     }

  //     const userUpdated = await this.userModel.findOneAndUpdate(
  //       { _id: user._id },
  //       { csvfile: files },
  //       { new: true },
  //     );

  //     return { message: 'CSV uploaded', userUpdated };
  //   } catch (error) {
  //     this.exceptionsService.handleDBExceptions(error);
  //   }
  // }

  // async getFiles(id: string) {
  //   try {
  //     const userFiles = await this.userModel.findOne({ _id: id });
  //     if (!userFiles) throw new NotFoundException('User not found');

  //     return {
  //       message: 'Files retrieved',
  //       files: userFiles.csvfile,
  //     };
  //   } catch (error) {
  //     this.exceptionsService.handleDBExceptions(error);
  //   }
  // }

  // async deleteFile(id: string, file: number) {
  //   try {
  //     const userFiles = await this.userModel.findOne({ _id: id });
  //     if (!userFiles) throw new NotFoundException('User not found');
  //     if (userFiles.csvfile.length === 0)
  //       throw new BadRequestException('No files found');
  //     const files = userFiles.csvfile;
  //     if (file >= files.length || file < 0)
  //       throw new BadRequestException('No files found');

  //     if (!files) throw new BadRequestException('No files found');
  //     files.splice(file, 1);

  //     const userUpdated = await this.userModel.findOneAndUpdate(
  //       { _id: id },
  //       { csvfile: files },
  //       { new: true },
  //     );

  //     return { message: 'File deleted', userUpdated };
  //   } catch (error) {
  //     this.exceptionsService.handleDBExceptions(error);
  //   }
  // }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}
