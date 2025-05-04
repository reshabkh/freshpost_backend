import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupWithEmailDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  contact_no: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
