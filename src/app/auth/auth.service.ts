import { UsersService } from './../modules/user/user.service';
import { RoleEnum } from '../common/enum';
import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as moment from 'moment-timezone';
moment.tz.setDefault('Asia/Karachi');

import { Response, Request } from 'express';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';
import { IUserToken } from './interface';

import { loginDTO, registerDTO } from './dto';
import { Cache } from 'cache-manager';

import { Helper } from 'src/app/common/helper/utilities.helper';
import { TokenEnum, responseEnum } from './enum';

const helper = new Helper();
@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private readonly helper: Helper,
    private config: ConfigService,
    private jwt: JwtService,

    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async login(response: Response, payload: loginDTO): Promise<null> {
    this.logger.log('Hits login service');
    const { userNameOrEmail, password } = payload;

    const user = await this.usersService.getUserForLogin(userNameOrEmail);

    //check if user exists
    if (!user) throw new UnauthorizedException(responseEnum.INVALID_CREDENTIAL);

    const isMatched = await this.helper.compareHash(password, user.password);

    if (!isMatched)
      throw new UnauthorizedException(responseEnum.INVALID_CREDENTIAL);

    //generate jwt token for the employee
    const accessTokenPayload = {
      role: user.role,
      email: user.email,
      type: 'access',
    };

    const accessToken = await this.signToken(
      accessTokenPayload,
      this.config.get().tokenExpiresDurationInMinutesForUser + 'm',
      this.config.get().jwtSecret,
    );

    //generate refresh token for the employee
    const refreshTokenPayload = {
      role: user.role,
      email: user.email,
      type: 'refresh',
    };

    const refreshToken = await this.signToken(
      refreshTokenPayload,
      this.config.get().refreshExpiresDurationInYears + 'Y',
      this.config.get().refreshSecret,
    );

    this.logger.log(`User: ${userNameOrEmail} logged in successfully`);

    response.cookie(TokenEnum.ACCESS, accessToken, {
      secure: false,
      httpOnly: true,
      expires: new Date(
        Number(new Date()) +
          Number(this.config.get().tokenExpiresDurationInMinutesForUser) *
            60 *
            1000,
      ),
      signed: true,
      // secret: this.config.get().cookieSecret,
    });

    response.cookie(TokenEnum.REFRESH, refreshToken, {
      secure: false,
      httpOnly: true,
      expires: new Date(
        Number(new Date()) +
          Number(this.config.get().refreshExpiresDurationInYears) *
            365 *
            24 *
            60 *
            60 *
            1000,
      ),
      signed: true,
      // secret: this.config.get().cookieSecret,
    });
    return null;
  }

  async register(body: registerDTO): Promise<null> {
    this.logger.log(`Register service hit`);
    const { password } = body;

    const hash = await this.helper.generateHash(password);

    await this.usersService.create({ ...body, password: hash });

    return null;
  }

  async logout(
    email: string,
    request: Request,
    response: Response,
  ): Promise<any> {
    const authToken = request?.signedCookies[TokenEnum.ACCESS];

    // get data from cache
    const cacheUserRecord = await this.cacheManager.get<{ name: string }>(
      email,
    );

    let cacheData: any;
    if (cacheUserRecord) {
      cacheData = JSON.parse(cacheUserRecord);
      cacheData[String(email)].push(authToken);
    } else {
      cacheData = {
        [email]: [authToken],
      };
    }
    // set cache data
    await this.cacheManager.set(email, JSON.stringify(cacheData), {
      ttl: this.config.get().cacheExpiresDurationInMinutes * 60,
    });

    // Clear cookie
    response.clearCookie('api-auth');

    this.logger.log(`User ${email} logged out successfully`);

    return null;
  }

  async signToken(
    payload: IUserToken,
    expiresIn: string,
    secret: string,
  ): Promise<string> {
    const token = await this.jwt.signAsync(payload, {
      expiresIn: expiresIn,
      secret: secret,
    });

    return token;
  }

  async tokenRefresh(user: any, response: Response): Promise<any> {
    this.logger.log('Hits tokenRefresh() hit');

    //generate jwt token for the employee
    const accessTokenPayload = {
      role: user.role,
      email: user.email,
      type: 'access',
    };

    const accessToken = await this.signToken(
      accessTokenPayload,
      this.config.get().tokenExpiresDurationInMinutesForUser + 'm',
      this.config.get().jwtSecret,
    );

    //generate refresh token for the employee
    const refreshTokenPayload = {
      role: user.role,
      email: user.email,
      type: 'refresh',
    };

    const refreshToken = await this.signToken(
      refreshTokenPayload,
      this.config.get().refreshExpiresDurationInYears + 'Y',
      this.config.get().refreshSecret,
    );

    response.cookie(TokenEnum.ACCESS, accessToken, {
      secure: false,
      httpOnly: true,
      expires: new Date(
        Number(new Date()) +
          Number(this.config.get().tokenExpiresDurationInMinutesForUser) *
            60 *
            1000,
      ),
      signed: true,
      // secret: this.config.get().cookieSecret,
    });

    response.cookie(TokenEnum.REFRESH, refreshToken, {
      secure: false,
      httpOnly: true,
      expires: new Date(
        Number(new Date()) +
          Number(this.config.get().refreshExpiresDurationInYears) *
            365 *
            24 *
            60 *
            60 *
            1000,
      ),
      signed: true,
      // secret: this.config.get().cookieSecret,
    });
    return null;
  }

  async validateUserToken(token: string, payload: IUserToken): Promise<any> {
    this.logger.log('Hits validateUserToken hit');

    return await this.usersService
      .getUserForLogin(payload.email)
      .then(async (clientData) => {
        if (!clientData) throw new UnauthorizedException('Invalid token');
        const redisUser = await this.cacheManager.get<{ name: string }>(
          payload.email,
        );
        if (redisUser) {
          let parsedUserData = JSON.parse(redisUser);
          parsedUserData = parsedUserData[payload.email];
          if (parsedUserData?.includes(token))
            throw new UnauthorizedException('Session expired');
        }
        return clientData;
      });
  }
}
