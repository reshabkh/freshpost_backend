import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class GetUserDto {
  
  @IsNotEmpty()
  id: string;

  @IsOptional()
  email: string;

}
