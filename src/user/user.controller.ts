import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserRegisterDTO } from './dto/user-register.dto';
import { UserLoginDTO } from './dto/user-login.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/users')
  getAllUsers() {
    return this.userService.getAll();
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserLoginDTO) {
    return this.userService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserRegisterDTO) {
    return this.userService.register(data);
  }
}
