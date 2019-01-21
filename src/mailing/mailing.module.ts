import { Module } from '@nestjs/common';

import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';
import { WeatherModule } from 'src/weather/weather.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from 'src/subscription/subscription.entity';
import { UserEntity } from 'src/user/user.entity';
import { CityEntity } from 'src/weather/entities/city.entity';
import { ForecastEntity } from 'src/weather/entities/forecast.entity';

@Module({
  imports: [
    WeatherModule,
    TypeOrmModule.forFeature([
      SubscriptionEntity,
      UserEntity,
      CityEntity,
      ForecastEntity,
    ]),
  ],
  providers: [MailingService],
  controllers: [MailingController],
})
export class MailingModule {}
