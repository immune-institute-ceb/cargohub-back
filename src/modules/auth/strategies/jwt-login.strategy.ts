// Objective: Implement the strategy to validate the token and return the user if it is valid.

//* Nest Modules
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

//* External Modules
import { ExtractJwt, Strategy } from 'passport-jwt';

//* Entities
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/entities/user.entity';
import { JwtPayload } from '../interfaces';
import { envs } from '@config/envs';

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

    if (user.isDeleted) throw new UnauthorizedException('User is archived');
    return user;
  }
}
