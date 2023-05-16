import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
