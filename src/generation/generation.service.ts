/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GenerationService {
  constructor(private readonly httpService: HttpService) {}

  async generateImage(prompt: string): Promise<string> {
    const url = 'https://openrouter.ai/api/v1/chat/completions'; // Update to correct Sora API endpoint

    const headers = {
      Authorization: `Bearer ${process.env.SORA_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const body = {
      model: 'sora', // or sora-1 depending on the API
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const response = await firstValueFrom(
      this.httpService.post(url, body, { headers }),
    );

    // Parse the image URL or base64 from response
    const imageUrl: any =
      response.data.choices[0].message?.content || 'No image generated';
    return imageUrl;
  }
}
