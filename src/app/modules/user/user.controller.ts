import {
  Controller,
  Get,
  HttpCode,
  UseGuards
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtGuard } from 'src/app/auth/guard';
import { GetUser, ResponseMessage } from 'src/app/common/decorator';
import { responseEnum } from './enum';
import { UsersService } from './user.service';

@Controller('user')
@ApiTags('user')
@ApiCookieAuth()
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get user
  @ResponseMessage(responseEnum.GET_USER)
  @ApiResponse({
    status: 200,
    description: responseEnum.GET_USER,
  })
  @Get()
  @HttpCode(200)
  async getUser(@GetUser() userData: any): Promise<any> {
    return this.usersService.getUser(userData.email);
  }
}
