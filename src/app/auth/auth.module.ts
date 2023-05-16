import { JwtStrategy, RefreshTokenStrategy } from './guard';
import { Module, CacheModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { ConfigModule } from 'src/config/config.module';

import { Helper } from 'src/app/common/helper/utilities.helper';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './schema ';


@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([AuthEntity])
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenStrategy, JwtStrategy, Helper],
  exports: [AuthService],
})
export class AuthModule {}
