import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class PostDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'unit id',
    example: '639b84a98faa2c3f68eb1459',
  })
  unit_id: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'validity date',
    example: '2022-12-18T17:48:29.273Z',
  })
  validity: string;
}
