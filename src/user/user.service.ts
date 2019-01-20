import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserRegisterDTO } from './dto/user-register.dto';
import { UserLoginDTO } from './dto/user-login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getAll() {
    const users = await this.userRepository.find();

    return users.map(user => user.toResponseObject());
  }

  async login(data: UserLoginDTO) {
    const { email, password } = data;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException('Invalid email/password', HttpStatus.BAD_REQUEST);
    }

    return user.toResponseObject(true);
  }

  async register(data: UserRegisterDTO) {
    const { email, password, name } = data;

    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = await this.userRepository.create({
      email,
      password,
      name,
    });
    await this.userRepository.save(newUser);

    return newUser.toResponseObject(true);
  }
}
