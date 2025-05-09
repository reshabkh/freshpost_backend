import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerateImageDto {
  
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsNotEmpty()
  interests: string[];

  @IsString()
  @IsOptional()
  author: string;

}
