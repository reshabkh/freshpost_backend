import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GenerationModule } from './generation/generation.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';
import { UserInterests } from './users/user-interests.model';
import { UserVerificationCode } from './users/user-verification-code.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev'],
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      models: [User, UserInterests, UserVerificationCode],
      synchronize: true,
      autoLoadModels: true,
      logging: false
    }),
    UsersModule,
    GenerationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
