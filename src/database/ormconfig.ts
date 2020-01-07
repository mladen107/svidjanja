import { ormconfigFactory } from './ormonfig.factory';
import { NestFactory } from '@nestjs/core';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

// This file is used by typeORM CLI to create ConnectionOptions

async function createConfig() {
  const app = await NestFactory.createApplicationContext(
    ConfigModule.forRoot(),
  );
  const configService = app.get(ConfigService);

  return ormconfigFactory(configService);
}

const config: Promise<ConnectionOptions> = createConfig();

export = config;
