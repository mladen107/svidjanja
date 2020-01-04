import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './sign-up.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.userService.createUser(signUpDto.username, signUpDto.password);
  }
}
