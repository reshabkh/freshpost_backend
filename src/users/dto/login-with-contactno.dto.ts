import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginWithContactNoDto {

  @IsNotEmpty()
  @IsString()
  contactNo: string;

  @IsNotEmpty()
  code: number;
}
