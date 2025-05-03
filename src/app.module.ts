import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GenerationModule } from './generation/generation.module';

@Module({
  imports: [UsersModule, GenerationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
