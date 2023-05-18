import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { PostSchema } from './schema';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostSchema)
    private readonly postRepository: Repository<PostSchema>,
  ) { }

  async findAll(): Promise<PostSchema[]> {
    const posts = await this.postRepository.find().catch((error) => { throw new InternalServerErrorException() })
    return posts
  }

  async findOne(id: number): Promise<PostSchema> {
    const post = await this.postRepository.findOne(id).catch((error) => { throw new InternalServerErrorException() })
    return post
  }

  async create(post: PostSchema): Promise<null> {
    await this.postRepository.save(post).catch((error) => { throw new InternalServerErrorException() });
    return null
  }

  async update(id: number, post: PostSchema): Promise<null> {
    await this.postRepository.update(id, post).catch((error) => { throw new InternalServerErrorException() });
    return null;
  }

  async remove(id: number): Promise<null> {
    await this.postRepository.delete(id).catch((error) => { throw new InternalServerErrorException() });
    return null;
  }
}
