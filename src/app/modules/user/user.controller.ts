import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //get all users
  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findall();
  }

  //get one user
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new Error('User not found');
    } else {
      return user;
    }
  }

  //create user
  @Post()
  async create(@Body() user: User): Promise<User> {
    return await this.usersService.create(user);
  }

  //update user
  @Put(':id')
  async update(@Param('id') id: number, @Body() user: User): Promise<User> {
    return this.usersService.update(id, user);
  }

  //delete user
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if user not found
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.usersService.delete(id);
  }
}


// import { Client, Employers } from './schema';
// import {
//   Body,
//   Controller,
//   Get,
//   HttpCode,
//   Patch,
//   Post,
//   Put,
//   UseGuards,
// } from '@nestjs/common';
// import { JwtGuard, RolesGuard } from 'src/app/auth/guard';
// import { GetUser, ResponseMessage, Roles } from 'src/app/common/decorator';
// import { UsersService } from './user.service';
// import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { responseEnum } from './enum';
// import { RoleEnum } from 'src/app/common/enum';
// import {
//   CreateClientDTO,
//   CreateNonEmployeeDTO,
//   GetClientWithCNIC,
//   GetDealerWithCnic,
//   UpdateClientDTO,
//   UpdateDealerDTO,
// } from './dto';
// @Controller('users')
// @ApiTags('users')
// @UseGuards(JwtGuard)
// @ApiBearerAuth('JWT-auth')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}
// =
//   @Roles([RoleEnum.REGIONAL_DIRECTOR, RoleEnum.EMPLOYEE])
//   @UseGuards(RolesGuard)
//   @ResponseMessage(responseEnum.GET_ALL_USERS)
//   @ApiResponse({
//     status: 200,
//     description: responseEnum.GET_ALL_USERS,
//   })
//   @Get('employees')
//   @HttpCode(200)
//   async getEmployees(): Promise<any> {
//     return await this.usersService.getEmployees();
//   }

// }
