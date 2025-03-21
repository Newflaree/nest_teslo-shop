import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import {
  CreateUserDto,
  LoginUserDto
} from './dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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

      // TODO: Return jwt
      return userDetails;
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

    // TODO: Return jwt
    return user;
  }

  private handleDBErrors( error: any ): never {
    if ( error.code === '23505' )
      throw new BadRequestException( error.detail );

    console.log( error );
    throw new InternalServerErrorException( 'Please check server logs' )
  }
}
