import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string) {
    const user = this.userRepository.create({ username, password });
    return await this.userRepository.save(user);
  }

  async findOneWithPassword(username: string) {
    return this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });
  }

  async findOneByName(username) {
    return this.userRepository.findOne({ username });
  }

  async updatePassword(userId, password) {
    return this.userRepository.update({ id: userId }, { password });
  }
}
