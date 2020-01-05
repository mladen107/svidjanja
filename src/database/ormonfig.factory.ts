import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from '../config/config.constants';

export function ormconfigFactory(configService: ConfigService): ConnectionOptions {
  return {
    type: 'postgres',
    host: configService.get(DB_HOST),
    port: configService.get(DB_PORT),
    username: configService.get(DB_USER),
    password: configService.get(DB_PASS),
    database: configService.get(DB_NAME),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,

    // Run migrations automatically,
    // you can disable this if you prefer running migration manually.
    migrationsRun: true,
    logging: true,
    logger: 'file',

    // Allow both start:prod and start:dev to use migrations
    // __dirname is either dist or src folder, meaning either
    // the compiled js in prod or the ts in dev.
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
    cli: {
      // Location of migration should be inside src folder
      // to be compiled into dist/ folder.
      migrationsDir: 'src/migrations',
    },
  };
}
