/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, Post, Version } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { GenerateImageDto } from './dto/generate-image.dto';

@Controller()
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}
  // @Version('1')
  @Post('generate-image')
  async generateImage(@Body() payload: GenerateImageDto) {
    const imageUrl = await this.generationService.generateImage(payload);
    return {
      status: 'success',
      code: 201,
      message: 'Images generated successfully',
      data: imageUrl,
      errors: []
    }
  }

  @Post('user/get-interests')
  async getUserInterests(@Body() payload: any) {
    const interests = await this.generationService.getUserInterests(payload);
    return {
      status: 'success',
      code: 201,
      message: 'Images generated successfully',
      data: interests,
      errors: []
    }
  }
}
