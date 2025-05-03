/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, Post, Version } from '@nestjs/common';
import { GenerationService } from './generation.service';

@Controller()
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}
  @Version('1')
  @Post('generate-image')
  async generateImage(@Body() payload: any) {
    const imageUrl = await this.generationService.generateImage(payload.prompt);
    return { imageUrl };
  }
}
