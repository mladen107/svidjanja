import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async hashPassword(rawPassword: string) {
    return await bcrypt.hash(rawPassword, 10);
  }

  async createUser(username: string, rawPassword: string) {
    const hashedPassword = await this.hashPassword(rawPassword);

    return this.userRepository.insert({ username, password: hashedPassword });
  }
}
