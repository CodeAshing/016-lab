import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtGuard, RolesGuard } from 'src/app/auth/guard';
import { ResponseMessage, Roles } from 'src/app/common/decorator';
import { RoleEnum } from 'src/app/common/enum';
import { postDTO } from './dto';
import { responseEnum } from './enum';
import { PostService } from './post.service';
import { PostSchema } from './schema';

@UseGuards(JwtGuard)
@Controller('Post')
@ApiTags('Post')
@ApiCookieAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ResponseMessage(responseEnum.GET_ALL_POSTS)
  @Get()
  @ApiResponse({ status: 200, description: responseEnum.GET_ALL_POSTS })
  @ApiResponse({ status: 404, description: responseEnum.POST_NOT_FOUND })
  async findAll(): Promise<PostSchema[]> {
    return this.postService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ADMIN])
  @ResponseMessage(responseEnum.GET_SINGLE_POST)
  @ApiResponse({ status: 200, description: responseEnum.GET_SINGLE_POST })
  @ApiResponse({ status: 404, description: responseEnum.POST_NOT_FOUND })
  async findOne(@Param('id') id: number): Promise<PostSchema> {
    return this.postService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ADMIN])
  @ResponseMessage(responseEnum.POST_UPLOADED_SUCCESSFULLY)
  @ApiResponse({
    status: 201,
    description: responseEnum.POST_UPLOADED_SUCCESSFULLY,
  })
  async create(@Body() post: postDTO): Promise<null> {
    return this.postService.create(post);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ADMIN])
  @ResponseMessage(responseEnum.POST_UPDATED_SUCCESSFULLY)
  @ApiResponse({
    status: 200,
    description: responseEnum.POST_UPDATED_SUCCESSFULLY,
  })
  @ApiResponse({ status: 404, description: responseEnum.POST_NOT_FOUND })
  async update(@Param('id') id: number, @Body() post: postDTO): Promise<null> {
    return this.postService.update(id, post);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ADMIN])
  @ResponseMessage(responseEnum.POST_DELETED_SUCCESSFULLY)
  @ApiResponse({
    status: 204,
    description: responseEnum.POST_DELETED_SUCCESSFULLY,
  })
  @ApiResponse({ status: 404, description: responseEnum.POST_NOT_FOUND })
  async remove(@Param('id') id: number): Promise<null> {
    return this.postService.remove(id);
  }
}
