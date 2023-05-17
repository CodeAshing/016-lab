import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './schema';


@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])

  ],
  exports: [PostModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule { }
