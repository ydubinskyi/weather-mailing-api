import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { SubscriptionEntity } from 'src/subscription/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SubscriptionEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
