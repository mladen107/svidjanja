import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { getConnectionToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

export const initApp = async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.init();

  const connection: Connection = moduleFixture.get(getConnectionToken());

  return {
    app,
    connection,
  };
};
