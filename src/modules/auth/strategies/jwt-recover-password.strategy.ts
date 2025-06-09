// Objective: Implement the strategy to validate the token and return the user if it is valid.

//* Nest Modules
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { envs } from '@config/envs';

//* External Modules
import { ExtractJwt, Strategy } from 'passport-jwt';

//* Interfaces
import { JwtPayload } from '../interfaces';

//* Services
import { UsersService } from '@modules/users/users.service';

@Injectable()
export class JwtRecoverPasswordStrategy extends PassportStrategy(
  Strategy,
  'jwt-recover-password',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      secretOrKey: envs.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const { _id, message } = payload;

    const user = await this.usersService.findUserById(_id);
    if (!user) throw new UnauthorizedException('Not valid recovery token');

    if (message !== 'recoverPassword' && message !== 'confirmEmail')
      throw new UnauthorizedException('Not valid recovery token');

    if (message === 'confirmEmail' && user.emailVerified)
      throw new UnauthorizedException('Email already verified');
    return {
      _id,
      message,
    };
  }
}
