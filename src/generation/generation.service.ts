/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import OpenAI from 'openai';
import fs from 'fs';

@Injectable()
export class GenerationService {
  constructor(private readonly httpService: HttpService) {}

  private readonly fieldMaxLengths: Record<string, number> = {
    NAME: 50,
  };

  async generateImagePrompts(payload: any): Promise<string[]> {
    const { interests, author } = payload;

    // if (!Array.isArray(interests) || interests.length === 0) {
    //   throw new Error('At least one interest is required');
    // }

    const url = 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.SORA_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not set');
    }

    const headers = {
      Authorization: `Bearer ${process.env.SORA_API_KEY}`,
      'Content-Type': 'application/json',
    };
    // 2. Instruct DALL·E to place the author’s name (“${author}”) only as a small signature in the bottom-right corner of the image.

    // System prompt: detailed instructions for crafting vivid scene descriptions
    const systemPrompt = `
You are a master prompt engineer for a content-generation app. Given:
  • A list of user interests (e.g. "nature", "fitness", "humor", etc.)
  • An author name

Your job is to output **only** a JSON array of DALL·E 2 text prompts (plain strings). Each prompt must:
1. Contain exactly one prompt per interest (so if the user passed 3 interests, you output exactly 3 prompts).
2. Focus on exactly one interest from the list (do NOT combine them).
3. Be vivid and imaginative—feel free to invent any scene, style, or detail that fits the interest.
4. Vary the descriptions so that repeated calls produce fresh, different imagery.
Respond with exactly the JSON array (e.g. ["prompt for interest 1", "prompt for interest 2", ...]).  
`.trim();


    const userPrompt = `Interests: ${interests.join(', ')}`;

    const promptPayload = {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      // max_tokens: 200,
      temperature: 0.8,
    };

    try {
      const res = await lastValueFrom(
        this.httpService.post(url, promptPayload, { headers }),
      );

      const text = res.data.choices[0].message.content.trim();
      console.log('text:', text);
      // Try to parse JSON array out of the model’s response
      let prompts: string[];
      try {
        prompts = JSON.parse(text);
        if (
          !Array.isArray(prompts) ||
          !prompts.every((p) => typeof p === 'string')
        ) {
          throw new Error();
        }
      } catch {
        throw new Error(`Expected a JSON array of strings, but got:\n${text}`);
      }

      // Ensure count matches interests
      if (prompts.length !== interests.length) {
        console.warn(
          `Warning: Generated ${prompts.length} prompts for ${interests.length} interests.`,
        );
      }

      return prompts;
    } catch (err: any) {
      console.error(
        'Error generating image prompts:',
        err.response?.data || err.message,
      );
      throw new Error('Failed to generate image prompts');
    }
  }

  async generateImage(generateIconDto: any): Promise<any> {
    const prompts = await this.generateImagePrompts(generateIconDto);

    const url = 'https://api.openai.com/v1/images/generations';
    const headers = {
      Authorization: `Bearer ${process.env.SORA_API_KEY}`,
      'Content-Type': 'application/json',
    };

    // Adjust parameters as needed (size can be 256x256, 512x512, or 1024x1024).
    // const payload = {
    //   model: 'dall-e-2',
    //   prompt: prompts[0],
    //   n: 1,
    //   size: '1024x1024',
    //   response_format: 'url',
    // };

    try {
      // 2️⃣ Map each prompt to a request-promise returning its URL
      const requests = prompts.map((prompt) =>
        lastValueFrom(
          this.httpService.post(
            url,
            {
              model: 'dall-e-2',
              prompt,
              n: 1,
              size: '1024x1024',
              response_format: 'url',
            },
            { headers },
          ),
        ).then((resp) => resp.data.data[0].url as string),
      );

      // 3️⃣ Wait for all of them
      const urls = await Promise.all(requests);

      // urls is now a string[] of length prompts.length
      return urls;
    } catch (error) {
      console.log('Error generating image:', error);
      console.error(
        'Error generating icon:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to generate icon');
    }
  }
}
