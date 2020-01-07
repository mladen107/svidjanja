import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { getConnectionToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();

    connection = moduleFixture.get(getConnectionToken());
    authService = app.get<AuthService>(AuthService);
  });

  beforeEach(
    async () => await connection.query('TRUNCATE "user" RESTART IDENTITY'),
  );
  afterAll(async () => await app.close());

  describe('/signup', () => {
    it('registers user and returns access token', async () => {
      const jwtService = app.get<JwtService>(JwtService);
      const mockInstance = jest
        .spyOn(jwtService, 'sign')
        .mockImplementation(() => 'token');

      await request(app.getHttpServer())
        .post('/signup')
        .send({ username: 'Test user', password: 'Pass@123' })
        .expect(201)
        .expect({
          access_token: 'token',
        });

      mockInstance.mockRestore();
    });

    it('returns 400 for empty name', async () => {
      await request(app.getHttpServer())
        .post('/signup')
        .send({ password: 'Pass@123' })
        .expect(400);
    });

    it('returns 400 for invalid password', async () => {
      await request(app.getHttpServer())
        .post('/signup')
        .send({ username: 'Test user' })
        .expect(400);

      await request(app.getHttpServer())
        .post('/signup')
        .send({ username: 'Test user', password: '111' })
        .expect(400);
    });

    it('returns 400 if the name is already used', async () => {
      await authService.signUp({ username: 'Test user', password: 'Pass@123' });

      await request(app.getHttpServer())
        .post('/signup')
        .send({ username: 'Test user', password: 'Pass@123' })
        .expect(400);
    });
  });

  it('/login', async () => {
    const jwtService = app.get<JwtService>(JwtService);
    const mockInstance = jest
      .spyOn(jwtService, 'sign')
      .mockImplementation(() => 'token');

    await authService.signUp({ username: 'Test user', password: 'Pass@123' });

    await request(app.getHttpServer())
      .post('/login')
      .send({ username: 'Test user', password: 'Pass@123' })
      .expect(201)
      .expect({
        access_token: 'token',
      });

    mockInstance.mockRestore();
  });

  it('/me', async () => {
    const { access_token } = await authService.signUp({
      username: 'Test user',
      password: 'Pass@123',
    });

    await request(app.getHttpServer())
      .get('/me')
      .set({ Authorization: `Bearer ${access_token}` })
      .expect(200)
      .expect({
        id: 1,
        username: 'Test user',
      });
  });
});
