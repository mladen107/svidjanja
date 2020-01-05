import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './sign-up.dto';
import { AuthService } from './auth.service';
import { StrategyType } from './strategy-type.enum';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(AuthGuard(StrategyType.LOCAL))
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard())
  @Get('me')
  currentUser(@Request() req) {
    return req.user;
  }
}
