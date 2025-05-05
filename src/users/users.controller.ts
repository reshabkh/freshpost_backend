import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/users/user.model';
import { SignupWithEmailDto } from './dto/signup-with-email.dto';
import { LoginWithEmailDto } from './dto/login-with-email.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('auth/signup')
  async signup(@Body() dto: SignupWithEmailDto): Promise<any> {
    const user = await this.userService.signup(dto);
    return {
      status: 'success',
      code: 201,
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
      code: 201,
      message: 'User logged in successfully',
      data: user,
      errors: []
    }
  }

  @Post('user/update')
  async updateUser(
    @Body() payload: UpdateUserDto,
  ): Promise<any> {
    await this.userService.updateUser(payload);
    return {
      status: 'success',
      code: 201,
      message: 'User updated successfully',
      data: [],
      errors: []
    }
  }

  @Post('user/get')
  async getUserDetails(
    @Body() payload: UpdateUserDto,
  ): Promise<any> {
    const user = await this.userService.getUser(payload);
    return {
      status: 'success',
      code: 201,
      message: 'User fetched successfully',
      data: user,
      errors: []
    }
  }
}
