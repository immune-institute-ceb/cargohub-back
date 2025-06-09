// Objective: Implement the strategy to validate the token and return the user if it is valid.

//* Nest Modules
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { envs } from '@config/envs';

//* External Modules
import { ExtractJwt, Strategy } from 'passport-jwt';

//* Entities
import { User } from '@modules/users/entities/user.entity';

//* Interfaces
import { JwtPayload } from '../interfaces';

//* Services
import { UsersService } from '@modules/users/users.service';
@Injectable()
export class JwtLoginStrategy extends PassportStrategy(Strategy, 'jwt-login') {
  constructor(private readonly usersService: UsersService) {
    super({
      secretOrKey: envs.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<User> {
    const { _id, message } = payload;
    if (message !== 'login')
      throw new UnauthorizedException('Not valid session token');

    const user = await this.usersService.findUserById(_id);
    if (!user) throw new UnauthorizedException('Not valid session token');
    if (!user.isActive || !user.emailVerified)
      throw new UnauthorizedException('User is inactive, talk with an admin');

    return user;
  }
}
