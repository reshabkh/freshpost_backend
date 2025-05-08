import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupWithEmailDto } from './dto/signup-with-email.dto';
import { User } from './user.model';
import { LoginWithEmailDto } from './dto/login-with-email.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { LoginWithContactNoDto } from './dto/login-with-contactno.dto';
import { UserVerificationCode } from './user-verification-code.model';

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

  async loginWithEmail(payload: LoginWithEmailDto): Promise<any> {
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

  async getUserVerificationCode(payload: any): Promise<number> {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    console.log('randomNum', randomNum);

    const dbExistingVerificationCode = await UserVerificationCode.findOne({
      where: { code: randomNum },
      raw: true
    });

    if (dbExistingVerificationCode) {
      return await this.getUserVerificationCode(payload.contactNo);
    }

    await UserVerificationCode.create({
      code: randomNum,
      contactNo: payload.contactNo
    });

    // await this.organisationVerificationCodeModel.create({
    //     code: randomNum,
    //     email: email
    // });
    return randomNum;
  }

  async loginWithContactNo(payload: LoginWithContactNoDto): Promise<any> {
    const dbUser = await this.userModel.findOne({ where: { contactNo: payload.contactNo }, raw: true });

    if (!dbUser) {

      // const hashedPassword = await bcrypt.hash(payload.password, 10);
      
      const user = await this.userModel.create({
        ...payload,
        // password: hashedPassword,
      });

      const accessToken = this.jwtService.sign({ contactNo: payload.contactNo, sub: user.id });

      // Update accessToken in DB
      await this.userModel.update(
        { accessToken },
        { where: { id: user.id } }
      );

      return { accessToken: accessToken, user: user };

    } else {

      const verifyCode = await UserVerificationCode.findOne({
        where: { contactNo: payload.contactNo, code: payload.code },
        raw: true
      });

      if(!verifyCode) {
        throw new BadRequestException('Invalid code');
      }

      // const isMatch = await bcrypt.compare(payload.password, dbUser.password);

      // if (!isMatch) {
      //   throw new UnauthorizedException('Incorrect password');
      // }
    
      const accessToken = this.jwtService.sign({ contactNo: dbUser.contactNo, sub: dbUser.id });
    
      // Update accessToken in DB
      await this.userModel.update(
        { accessToken },
        { where: { id: dbUser.id } }
      );

      return { accessToken: accessToken, user: dbUser };

    }
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
