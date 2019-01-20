import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Entity('subscriptions')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  email: string;

  @Column('text')
  city: string;

  @ManyToOne(type => UserEntity, user => user.subscriptions)
  author: UserEntity;

  toResponseObject() {
    const { created, updated, email, city, author } = this;

    return { created, updated, email, city, author: author.toResponseObject() };
  }
}
