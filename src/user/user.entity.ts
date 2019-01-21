import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { UserResponseObject } from './interfaces/user-ro.interface';
import { UserRole } from './enums/user-role.enum';
import { SubscriptionEntity } from 'src/subscription/subscription.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column('text')
  email: string;

  @Column('text')
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @Column('text')
  password: string;

  @OneToMany(type => SubscriptionEntity, subscription => subscription.author)
  subscriptions: SubscriptionEntity[];

  @BeforeInsert()
  async hasPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(withToken: boolean = false): UserResponseObject {
    const { id, created, email, name, role } = this;

    if (withToken) {
      return {
        id,
        created,
        email,
        name,
        token: this.token,
        role,
      };
    }

    return { id, created, email, name, role };
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { id, email } = this;

    return jwt.sign(
      {
        id,
        sub: email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );
  }
}
