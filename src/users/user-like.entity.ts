import { Entity, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';

@Entity()
@Index(['giver', 'receiver'], { unique: true })
export class UserLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    user => user.givenLikes,
  )
  giver: User;

  @ManyToOne(
    () => User,
    user => user.receivedLikes,
  )
  receiver: User;
}
