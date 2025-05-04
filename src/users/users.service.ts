import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupWithEmailDto } from './dto/signup-with-email.dto';
import { User } from './user.model';
import { LoginWithEmailDto } from './dto/login-with-email.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  async signup(dto: SignupWithEmailDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      where: { email: dto.email },
    });
    if (existingUser) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
    });

    return user;
  }

  async login(dto: LoginWithEmailDto): Promise<{ accessToken: string }> {
    const user = await this.userModel.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'mysecret',
      {
        expiresIn: '1h',
      },
    );

    user.accessToken = token;
    await user.save();

    return { accessToken: token };
  }
}
