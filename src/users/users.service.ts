import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupWithEmailDto } from './dto/signup-with-email.dto';
import { User } from './user.model';
import { LoginWithEmailDto } from './dto/login-with-email.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async signup(payload: SignupWithEmailDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      where: { email: payload.email },
    });
    if (existingUser) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const accessToken = this.jwtService.sign({ email: payload.email, sub: payload.email });

    const user = await this.userModel.create({
      ...payload,
      password: hashedPassword,
      accessToken
    });

    return user;
  }

  async login(payload: LoginWithEmailDto): Promise<any> {
    const user = await this.userModel.findOne({ where: { email: payload.email }, raw: true });

  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  if (!payload.password || !user.password) {
    throw new BadRequestException('Password is required');
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const accessToken = this.jwtService.sign({ email: user.email, sub: user.id });

  // Update accessToken in DB
  await this.userModel.update(
    { accessToken },
    { where: { id: user.id } }
  );

    return { accessToken: accessToken, user: { ...user, password: undefined } };
  }

  async updateUser(payload: any): Promise<any> {
    const user = await this.userModel.findOne({ where: { id: payload.id } });
    if (!user) throw new BadRequestException('User not found');

    // if (payload.password) {
    //   const hashedPassword = await bcrypt.hash(payload.password, 10);
    //   payload.password = hashedPassword;
    // }

    await this.userModel.update(
      { ...payload },
      { where: { id: payload.id } }
    );

    return [];
  }

  async getUser(payload: any): Promise<any> {
    const whereOptions: any = {};

    if (payload.email) {
      whereOptions.email = payload.email;
    } else {
      whereOptions.id = payload.id;
    }
    const user = await this.userModel.findOne({ where: whereOptions });
    if (!user) throw new BadRequestException('User not found');

    return user;
  }
}
