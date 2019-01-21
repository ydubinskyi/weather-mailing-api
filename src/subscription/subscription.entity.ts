import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CityEntity } from 'src/weather/entities/city.entity';

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

  @ManyToOne(type => UserEntity, user => user.subscriptions)
  author: UserEntity;

  @ManyToOne(type => CityEntity, city => city.id)
  city: CityEntity;

  toResponseObject() {
    const { id, created, updated, email, city, author } = this;

    return { id, created, updated, email, city: city.toResponseObject(), author: author.toResponseObject() };
  }
}
