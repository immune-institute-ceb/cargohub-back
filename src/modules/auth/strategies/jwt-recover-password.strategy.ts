// Objective: Implement the strategy to validate the token and return the user if it is valid.

//* Nest Modules
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { envs } from '@config/envs';

//* External Modules
import { ExtractJwt, Strategy } from 'passport-jwt';

//* Interfaces
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtRecoverPasswordStrategy extends PassportStrategy(
  Strategy,
  'jwt-recover-password',
) {
  constructor() {
    super({
      secretOrKey: envs.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const { _id, message } = payload;
    if (message !== 'recoverPassword' && message !== 'confirmEmail')
      throw new UnauthorizedException('Not valid recovery token');

    return {
      _id,
      message,
    };
  }
}
