import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/users/user.model';
import { SignupWithEmailDto } from './dto/signup-with-email.dto';
import { LoginWithEmailDto } from './dto/login-with-email.dto';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('auth/signup')
  async signup(@Body() dto: SignupWithEmailDto): Promise<any> {
    const user = await this.userService.signup(dto);
    return {
      status: 'success',
      message: 'User registered successfully',
      data: user,
      errors: []
    }
  }

  @Post('auth/login')
  async login(
    @Body() dto: LoginWithEmailDto,
  ): Promise<any> {
    const user = await this.userService.login(dto);
    return {
      status: 'success',
      message: 'User logged in successfully',
      data: user,
      errors: []
    }
  }
}
