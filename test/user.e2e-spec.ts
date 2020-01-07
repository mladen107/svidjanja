import * as request from 'supertest';
import {
  INestApplication,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { initApp } from './helpers/init-app';
import { UsersService } from '../src/users/users.service';
import { AuthService } from '../src/auth/auth.service';

const users = [
  {
    username: 'User1',
    password: 'Pass@123',
  },
  {
    username: 'User2',
    password: 'Pass@123',
  },
  {
    username: 'User3',
    password: 'Pass@123',
  },
];

describe('User controller (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let userService: UsersService;
  let authService: AuthService;
  let userAccessTokens: string[];

  beforeAll(async () => {
    const appContainer = await initApp();
    app = appContainer.app;
    connection = appContainer.connection;
    userService = app.get(UsersService);
    authService = app.get(AuthService);
  });

  beforeEach(
    async () => {
      await connection.query('TRUNCATE "user" RESTART IDENTITY CASCADE');
      userAccessTokens = [];
      for (const user of users) {
        const { access_token } = await authService.signUp(user);
        userAccessTokens.push(access_token);
      }
    });

  afterAll(async () => await app.close());

  describe('/user/:id', () => {
    it('returns correct data for user without likes', async () => {
      const username = users[0].username;
      const noOfLikes = 0;

      await request(app.getHttpServer())
        .get(`/user/${1}`)
        .expect(200)
        .expect({ username, noOfLikes });
    });

    it('returns correct data when liked', async () => {
      const username = users[0].username;
      const noOfLikes = 2;
      await userService.like(2, 1);
      await userService.like(3, 1);
      await request(app.getHttpServer())
        .get(`/user/${1}`)
        .expect(200)
        .expect({ username, noOfLikes });
    });

    it('returns correct data for user without likes', async () => {
      const username = users[0].username;
      const noOfLikes = 0;

      await request(app.getHttpServer())
        .get(`/user/${1}`)
        .expect(200)
        .expect({ username, noOfLikes });
    });

    it('returns 422 when user id doesn\'t exists', async () => {
      await request(app.getHttpServer())
        .get(`/user/${4}`)
        .expect(422);
    });

    it('returns 400 when user id is not number', async () => {
      await request(app.getHttpServer())
        .get(`/user/test`)
        .expect(400);
    });
  });

  describe('/user/:id/like', () => {
    it('lets user to like other user successfully', async () => {
      const username = users[0].username;
      const noOfLikes = 0;

      await request(app.getHttpServer())
        .post(`/user/${1}/like`)
        .set({ Authorization: `Bearer ${userAccessTokens[1]}` })
        .expect(201);
    });

    it('does not let user to like itself', async () => {
      await request(app.getHttpServer())
        .post(`/user/${1}/like`)
        .set({ Authorization: `Bearer ${userAccessTokens[0]}` })
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'You can not like yourself.',
        });
    });

    it('does not let user to like other user 2 times', async () => {
      await userService.like(2, 1);

      await request(app.getHttpServer())
        .post(`/user/${1}/like`)
        .set({ Authorization: `Bearer ${userAccessTokens[1]}` })
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'You already liked this user.',
        });
    });
  });

  describe('/user/:id/unlike', () => {
    it('lets user to unlike other liked user successfully', async () => {
      await userService.like(2, 1);
      await request(app.getHttpServer())
        .delete(`/user/${1}/unlike`)
        .set({ Authorization: `Bearer ${userAccessTokens[1]}` })
        .expect(200);

      const { noOfLikes } = await userService.getNameAndLikes(1);
      expect(noOfLikes).toBe(0);
    });
  });

  describe('most-liked', () => {
    it('returns list of users ordered by number of likes', async () => {
      await userService.like(1, 2);
      await userService.like(1, 3);
      await userService.like(3, 2);
      await request(app.getHttpServer())
        .get(`/most-liked`)
        .expect(200)
        .expect([
          { username: users[1].username, noOfLikes: 2 },
          { username: users[2].username, noOfLikes: 1 },
          { username: users[0].username, noOfLikes: 0 },
          ]);
    });
  });
});
