import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { responseEnum } from './enum';
import { GetUser, ResponseMessage } from 'src/app/common/decorator';
import { JwtGuard } from 'src/app/auth/guard';

@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@Controller('Post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly PostService: PostService) {}

  // @Post('unPost-unit')
  // @ResponseMessage(responseEnum.UN_Post_UNIT_SUCCESS)
  // @ApiResponse({
  //   status: 200,
  //   description: responseEnum.UN_Post_UNIT_SUCCESS,
  // })
  // @UsePipes(ValidationPipe)
  // @HttpCode(200)
  // async unPostUnit(
  //   @Body() body: UnPostDTO,
  //   @GetUser() userData: any,
  // ): Promise<any> {
  //   console.log('aa');
  //   return await this.PostService.unPostUnit(body, userData);
  // }

  // @Post('get-Poster-details')
  // @ResponseMessage(responseEnum.UNIT_SET_TO_Post)
  // @ApiResponse({
  //   status: 200,
  //   description: responseEnum.UNIT_SET_TO_Post,
  // })
  // @UsePipes(ValidationPipe)
  // @HttpCode(200)
  // async getPostUnit(@Body() body: getPostUnitDTO): Promise<any> {
  //   return await this.PostService.getPostUnit(body);
  // }

  // @Post('Post-unit')
  // @ResponseMessage(responseEnum.UNIT_Post_SUCCESS)
  // @ApiResponse({
  //   status: 200,
  //   description: responseEnum.UNIT_Post_SUCCESS,
  // })
  // @UsePipes(ValidationPipe)
  // @HttpCode(200)
  // async PostUnit(
  //   @GetUser() userData: any,
  //   @Body() body: PostDTO,
  // ): Promise<any> {
  //   return await this.PostService.PostUnit(body, userData);
  // }

  // @Post('in-progress')
  // @ResponseMessage(responseEnum.UNIT_IS_SET_TO_INPROGRESS)
  // @ApiResponse({
  //   status: 200,
  //   description: responseEnum.UNIT_IS_SET_TO_INPROGRESS,
  // })
  // @UsePipes(ValidationPipe)
  // @HttpCode(200)
  // async inProgress(
  //   @GetUser() userData: any,
  //   @Body() body: InProgressDTO,
  // ): Promise<any> {
  //   return await this.PostService.inProgress(
  //     body.unit_id,
  //     body.inProgressFor,
  //     body.validity,
  //     userData,
  //   );
  // }
}
