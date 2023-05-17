import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSchema } from './schema';
import { registerDTO } from 'src/app/auth/dto';
import { responseEnum } from 'src/app/auth/enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserSchema)
    private usersRepository: Repository<UserSchema>,
  ) { }


  // get user for login
  async getUserForLogin(userNameOrEmail: string): Promise<any> {
    return await this.usersRepository.findOne({
      where: [
        { userName: userNameOrEmail },
        { email: userNameOrEmail },
      ],
    });
  }

  // get user
  async getUser(userNameOrEmail: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: [
        { userName: userNameOrEmail },
        { email: userNameOrEmail },
      ],
      select: ["id", "firstName", "lastName", "email", "userName", "role"], // Specify the columns to include in the result

    });

    //check if user exists
    if (!user)
      throw new NotFoundException(responseEnum.INVALID_CREDENTIAL);

    return user
  }

  // create user
  async create(user: registerDTO): Promise<UserSchema> {
    try {
      const newUser = this.usersRepository.create(user);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      // Check for duplicate entry error
      if (error.code === '23505') {
        if (error.detail.includes('email')) {
          throw new BadRequestException(responseEnum.EMAIL_ALREADY_EXIST);
        } else if (error.detail.includes('userName')) {
          throw new BadRequestException(responseEnum.USERNAME_ALREADY_EXIST);
        }
      }

      // Rethrow the error if it's not a duplicate entry error
      throw new InternalServerErrorException()
    }
  }

  // update user
  async update(id: number, user: UserSchema): Promise<UserSchema> {
    await this.usersRepository.update(id, user);
    return await this.usersRepository.findOne({ where: { id } });
  }

  // delete user
  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}