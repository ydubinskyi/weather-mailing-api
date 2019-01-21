import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionEntity } from './subscription.entity';
import { UserEntity } from 'src/user/user.entity';
import { CityEntity } from 'src/weather/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity, UserEntity, CityEntity])],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
