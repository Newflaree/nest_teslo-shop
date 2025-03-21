import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import {
  CreateUserDto,
  LoginUserDto
} from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });

      await this.userRepository.save( user );

      const { password: pass, ...userDetails } = user;

      return {
        ...userDetails,
        token: this.getJwt({ email: user.email })
      };
    } catch ( error ) {
      this.handleDBErrors( error );
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    });

    if ( !user )
      throw new UnauthorizedException( 'Not valid credentials' )

    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException( 'Not valid credentials' )

    return {
      ...user,
      token: this.getJwt({ email: user.email })
    };
  }

  private getJwt( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload );
    return token;
  }

  private handleDBErrors( error: any ): never {
    if ( error.code === '23505' )
      throw new BadRequestException( error.detail );

    console.log( error );
    throw new InternalServerErrorException( 'Please check server logs' )
  }
}
