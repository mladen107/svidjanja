import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserLike } from './user-like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ length: 255 })
  username: string;

  @Exclude()
  @Column({ length: 255, select: false })
  password: string;

  @OneToMany(
    type => UserLike,
    userLike => userLike.giver,
  )
  givenLikes: UserLike[];

  @OneToMany(
    type => UserLike,
    userLike => userLike.receiver,
  )
  receivedLikes: UserLike[];
}
