import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { StrategyType } from './strategy-type.enum';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(AuthGuard(StrategyType.LOCAL))
  @Post('login')
  @HttpCode(200)
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard())
  @Get('me')
  currentUser(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard())
  @Post('/me/update-password') // Password resets are not idempotent, that's why not PUT
  @HttpCode(200)
  updatePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const user = req.user;
    return this.authService.updatePassword(user, changePasswordDto);
  }
}
