import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction, TransactionRepository } from 'typeorm';
import { User } from './user.entity';
import { UserLike } from './user-like.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserLike)
    private readonly userLikeRepository: Repository<UserLike>,
  ) {}

  async create(username: string, password: string) {
    const user = this.userRepository.create({ username, password });
    return await this.userRepository.save(user);
  }

  async findOneWithPassword(username: string) {
    return this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });
  }

  async findOneByName(username) {
    return this.userRepository.findOne({ username });
  }

  async updatePassword(userId, password) {
    return this.userRepository.update({ id: userId }, { password });
  }

  async getNameAndLikes(id) {
    const userLikesRaw = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.username as username', 'COUNT(user_like.id)'])
      .leftJoin('user.receivedLikes', 'user_like')
      .where({ id })
      .groupBy('user.id')
      .getRawOne();
    if (!userLikesRaw) {
      throw new UnprocessableEntityException('User not found.');
    }
    return this.mapUserLikesCount(userLikesRaw);
  }

  @Transaction()
  async like(
    giverId: number,
    receiverId: number,
    @TransactionRepository(UserLike) userLikeRepository?: Repository<UserLike>,
  ) {
    if (giverId === receiverId) {
      throw new BadRequestException('You can not like yourself.');
    }

    const existingLike = await userLikeRepository.findOne({
      giver: { id: giverId },
      receiver: { id: receiverId },
    });

    if (existingLike) {
      throw new BadRequestException('You already liked this user.');
    }

    const userLike = userLikeRepository.create({
      giver: { id: giverId },
      receiver: { id: receiverId },
    });
    return userLikeRepository.save(userLike);
  }

  async unlike(giverId, receiverId) {
    return this.userLikeRepository.delete({
      giver: { id: giverId },
      receiver: { id: receiverId },
    });
  }

  async getMostLiked() {
    const userLikesRaw = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.username as username', 'COUNT(user_like.id)'])
      .leftJoin('user.receivedLikes', 'user_like')
      .groupBy('user.id')
      .execute();

    return userLikesRaw.map(item => this.mapUserLikesCount(item));
  }

  private mapUserLikesCount(userScore: any) {
    return {
      username: userScore.username,
      noOfLikes: Number(userScore.count),
    };
  }
}
