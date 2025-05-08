import { Module } from '@nestjs/common';
import { GenerationController } from './generation.controller';
import { GenerationService } from './generation.service';
import { HttpModule } from '@nestjs/axios';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserInterests } from 'src/users/user-interests.model';

@Module({
  imports: [HttpModule, SequelizeModule.forFeature([UserInterests])],
  controllers: [GenerationController],
  providers: [GenerationService],
})
export class GenerationModule {}
