import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/users/user.model';
import { SignupWithEmailDto } from './dto/signup-with-email.dto';
import { LoginWithEmailDto } from './dto/login-with-email.dto';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('auth/signup')
  async signup(@Body() dto: SignupWithEmailDto): Promise<User> {
    return this.userService.signup(dto);
  }

  @Post('auth/login')
  async login(
    @Body() dto: LoginWithEmailDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.login(dto);
  }
}
