import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IsUserAlreadyExistConstraint } from './validators/unique-username.validator';
import { UserLike } from './user-like.entity';
import { PassportModule } from '@nestjs/passport';
import { StrategyType } from '../auth/strategy-type.enum';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: StrategyType.JWT }),
    TypeOrmModule.forFeature([User, UserLike]),
  ],
  providers: [UsersService, IsUserAlreadyExistConstraint],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
