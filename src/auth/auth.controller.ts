import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  SetMetadata,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import {
  Auth,
  GetUser,
  RawHeaders,
  RoleProtected
} from './decorators';
import { ValidRoles } from './interfaces';


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

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus( user );
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    //@Req() request: Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders
    }
  }

  //@SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @RoleProtected( ValidRoles.superUser )
  @UseGuards( AuthGuard(), UserRoleGuard )
  prviateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth( ValidRoles.superUser, ValidRoles.admin )
  prviateRoute3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }
}
