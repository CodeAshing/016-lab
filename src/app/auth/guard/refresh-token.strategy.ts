import { RoleEnum } from '../../common/enum/roles.enum';
import { AuthService } from 'src/app/auth/auth.service';
import {
  Inject,
  Injectable,
  UnauthorizedException,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from 'src/config/config.service';
import { Strategy } from 'passport-jwt';
import { TokenEnum, responseEnum } from '../enum';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'RefreshTokenStrategy',
) {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: (request: any) =>
        request?.signedCookies[TokenEnum.REFRESH],
      ignoreExpiration: false,
      maxAge: '7d',
      passReqToCallback: true,
      secretOrKey: configService.get().refreshSecret,
    });
  }

  async validate(request: any, payload: any) {
    if (!payload) throw new UnauthorizedException(responseEnum.NOT_AUTHORIZED);

    const token = request?.signedCookies[TokenEnum.REFRESH];
    if (!token) throw new UnauthorizedException(responseEnum.NOT_AUTHORIZED);

    const addToCache = async (key: any, value: string) => {
      // get data from cache
      const cacheUserRecord = await this.cacheManager.get<{ name: string }>(
        key,
      );

      let cacheData: any;
      if (cacheUserRecord) {
        cacheData = JSON.parse(cacheUserRecord);
        cacheData[String(key)].push(value);
      } else {
        cacheData = {
          [key]: [value],
        };
      }
      // set cache data
      await this.cacheManager.set(key, JSON.stringify(cacheData), {
        ttl: this.configService.get().cacheExpiresDurationInMinutes * 60,
      });
    };

    const data = await this.authService.validateUserToken(token, payload);
    if (!data) throw new UnauthorizedException(responseEnum.NOT_AUTHORIZED);

    await addToCache(payload.employeeCode, token);
    return data;
  }
}
