import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ormconfigFactory } from './ormonfig.factory';

export const databaseOrmModule = TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => {
    return ormconfigFactory(configService);
  },
  inject: [ConfigService],
});
