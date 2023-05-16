import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class getPostUnitDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'unit id',
    example: '639b84a98faa2c3f68eb1459',
  })
  unit_id: string;
}
