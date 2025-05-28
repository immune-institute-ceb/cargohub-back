// Objective: Implement the strategy to validate the token and return the user if it is valid.

//* Nest Modules
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

//* External Modules
import { ExtractJwt, Strategy } from 'passport-jwt';

//* Entities
import { JwtPayload } from '../interfaces';
import { envs } from '@config/envs';

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

  validate(req: Request, payload: JwtPayload): string {
    const { _id, message } = payload;
    if (message !== 'recoverPassword' && message !== 'confirmEmail')
      throw new UnauthorizedException('Not valid recovery token');

    return _id;
  }
}
