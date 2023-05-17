import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class loginDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'username or email', example: 'asharib90' })
  userNameOrEmail: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Password', example: '123456' })
  password: string;
}
