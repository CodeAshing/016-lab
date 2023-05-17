import { IsNotEmpty } from '@nestjs/class-validator';

export class groupClientSaleDetailsDTODTO {
  @IsNotEmpty({ message: 'Please provide valid cnic' })
  cnic: string;

  @IsNotEmpty()
  otp: number;
}

export class authoritySaleDetailsDTO {
  @IsNotEmpty()
  token: string;
}

