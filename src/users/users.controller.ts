import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { FindOneParamsDto } from './dto/find-one-params.dto';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('user/:id')
  nameAndLikes(@Param() params: FindOneParamsDto) {
    return this.userService.getNameAndLikes(params.id);
  }

  @UseGuards(AuthGuard())
  @Post('user/:id/like')
  async like(@Request() req, @Param() params: FindOneParamsDto) {
    await this.userService.like(req.user.id, Number(params.id));
  }

  @UseGuards(AuthGuard())
  @Delete('user/:id/unlike')
  async userNameAndLikes(@Request() req, @Param() params: FindOneParamsDto) {
    await this.userService.unlike(req.user.id, Number(params.id));
  }

  @Get('most-liked')
  mostLiked() {
    return this.userService.getMostLiked();
  }
}
