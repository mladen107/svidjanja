import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './sign-up.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneWithPassword(username);
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      return user;
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const { username, password } = signUpDto;
    const hashedPassword = await this.hashPassword(password);
    return await this.usersService.createUser(username, hashedPassword);
  }

  private async hashPassword(rawPassword: string) {
    return await bcrypt.hash(rawPassword, 10);
  }
}
