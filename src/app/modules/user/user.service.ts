import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSchema } from './schema';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserSchema)
    private usersRepository: Repository<UserSchema>,
  ) { }

  // get all users
  async findall(): Promise<UserSchema[]> {
    return await this.usersRepository.find();
  }

  // get one user
  async findOne(id: number): Promise<UserSchema> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  //create user
  async create(user: UserSchema): Promise<UserSchema> {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
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