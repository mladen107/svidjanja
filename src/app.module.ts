import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseOrmModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

const IS_TEST_ENVIRONMENT = process.env.NODE_ENV === 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: IS_TEST_ENVIRONMENT ? '.env.test' : '.env',
    }),
    databaseOrmModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
