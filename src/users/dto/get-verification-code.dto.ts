import { IsNotEmpty, IsString } from 'class-validator';

export class GetVerificationCodeDto {

  @IsNotEmpty()
  @IsString()
  contactNo: string;

}
