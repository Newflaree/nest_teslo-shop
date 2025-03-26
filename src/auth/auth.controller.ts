import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';


import {
  CreateUserDto,
  LoginUserDto
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }


  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    //@Req() request: Request
    @GetUser() user: User
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user
    }
  }
}
