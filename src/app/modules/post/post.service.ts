import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { postDTO } from './dto';
import { responseEnum } from './enum';
import { PostSchema } from './schema';

@Injectable()
export class PostService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(PostSchema)
    private readonly postRepository: Repository<PostSchema>,
  ) {}

  async findAll(): Promise<PostSchema[]> {
    this.logger.log(`findAll service hit`);
    const posts = await this.postRepository.find();
    if (!posts.length) throw new NotFoundException(responseEnum.POST_NOT_FOUND);
    return posts;
  }

  async findOne(id: number): Promise<PostSchema> {
    this.logger.log(`findOne service hit`);

    const post = await this.postRepository.findOne(id);

    if (!post) throw new NotFoundException(responseEnum.POST_NOT_FOUND);

    return post;
  }

  async create(post: postDTO): Promise<null> {
    this.logger.log(`create service hit`);

    await this.postRepository.save(post);
    return null;
  }

  async update(id: number, post: postDTO): Promise<null> {
    this.logger.log(`update service hit`);

    await this.postRepository.update(id, post);
    return null;
  }

  async remove(id: number): Promise<null> {
    this.logger.log(`remove service hit`);

    const post = await this.postRepository.findOne(id);

    if (!post) throw new NotFoundException(responseEnum.POST_NOT_FOUND);

    await this.postRepository.delete(id);
    return null;
  }
}
