import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginWithEmailDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
