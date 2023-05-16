import { Module } from '@nestjs/common';
import { PostController } from './Post.controller';
import { PostService } from './Post.service';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])

  ],
  exports: [PostModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule { }
