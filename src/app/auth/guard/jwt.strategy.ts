import { RoleEnum } from '../../common/enum/roles.enum';
import { AuthService } from 'src/app/auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ConfigService } from 'src/config/config.service';
import { Strategy } from 'passport-jwt';
import { TokenEnum, responseEnum } from '../enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: (request: any) =>
        request?.signedCookies[TokenEnum.ACCESS],
      ignoreExpiration: false,
      maxAge: '7d',
      passReqToCallback: true,
      secretOrKey: configService.get().jwtSecret,
    });
  }

  async validate(request: any, payload: any) {
    if (!payload) throw new UnauthorizedException(responseEnum.NOT_AUTHORIZED);

    const token = request?.signedCookies[TokenEnum.ACCESS];

    const data = await this.authService.validateUserToken(
      token,
      payload,
    );
    if (!data) throw new UnauthorizedException(responseEnum.NOT_AUTHORIZED);

    return data
  }
}
