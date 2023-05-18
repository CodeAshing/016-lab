import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class postDTO {
  @IsNotEmpty()
  @ApiProperty({ description: 'title', example: 'NestJS' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'description', example: 'This is description' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'createdBy', example: 'asharib ahmed' })
  createdBy: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'image',
    example:
      'https://arctype.com/blog/content/images/size/w1750/2022/01/nest.png',
  })
  image: string;
}
