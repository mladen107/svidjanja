import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IsUserAlreadyExistConstraint } from './validators/unique-username.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, IsUserAlreadyExistConstraint],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
