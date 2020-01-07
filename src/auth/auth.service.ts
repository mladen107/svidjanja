import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

const hashPassword = async (rawPassword: string) => {
  return await bcrypt.hash(rawPassword, 10);
};

const comparePassword = async (password1: string, password2: string) => {
  return await bcrypt.compare(password1, password2);
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneWithPassword(username);
    if (user) {
      const validPassword = await comparePassword(password, user.password);
      if (validPassword) {
        return user;
      }
    }
  }

  login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const { username, password } = signUpDto;
    const hashedPassword = await hashPassword(password);
    const user = await this.usersService.createUser(username, hashedPassword);
    return this.login(user);
  }

  async updatePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const { id, username } = user;
    const { oldPassword, newPassword } = changePasswordDto;

    if (oldPassword === newPassword) {
      throw new BadRequestException(
        'New password must be different from old password.',
      );
    }

    const userWithPassword = await this.usersService.findOneWithPassword(
      username,
    );

    if (!userWithPassword) {
      throw new UnauthorizedException('User not found.');
    }

    const { password } = userWithPassword;
    const validPassword = await comparePassword(oldPassword, password);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid old password.');
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await this.usersService.updatePassword(id, hashedNewPassword);
  }
}
