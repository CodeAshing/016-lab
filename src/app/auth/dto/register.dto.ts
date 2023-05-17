import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEmail, IsString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { RoleEnum } from 'src/app/common/enum';


@ValidatorConstraint({ name: 'validRole', async: false })
class ValidRoleConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return value === RoleEnum.ADMIN || value === RoleEnum.USER;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be either 'admin' or 'user'`;
  }
}

export class registerDTO {
  @IsNotEmpty()
  @ApiProperty({ description: 'firstName', example: 'Asharib' })
  firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: 'lastName', example: 'Ahmed' })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'email', example: 'asharibahmed143@gmail.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Username', example: 'asharib90' })
  userName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value && value.toLowerCase().trim())
  @Validate(ValidRoleConstraint)
  @ApiProperty({ description: 'role', example: RoleEnum.ADMIN, enum: [RoleEnum.ADMIN, RoleEnum.USER] })
  role: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'password', example: '123456' })
  password: string;
}
