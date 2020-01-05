import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Exclude } from 'class-transformer';

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
}
