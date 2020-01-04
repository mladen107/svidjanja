import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseOrmModule } from './database/database.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseOrmModule(), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
