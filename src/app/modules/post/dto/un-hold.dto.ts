import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class UnPostDTO {
  @IsNotEmpty({ message: 'please provide Post Id' })
  @ApiProperty({
    description: 'unit id',
    example: '639b84a98faa2c3f68eb1459',
  })
  Post_id: mongoose.Types.ObjectId;
}
