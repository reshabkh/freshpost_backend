import { IsArray, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  
  @IsNotEmpty()
  id: string;

  @IsOptional()
  profileImg: string;

  @IsArray()
  @IsOptional()
  interests: string[];
}
