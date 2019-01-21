import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AuthGuard } from './shared/auth.guard';
import { WeatherModule } from './weather/weather.module';
import { MailingModule } from './mailing/mailing.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    SubscriptionModule,
    WeatherModule,
    MailingModule,
  ],
  providers: [AuthGuard],
})
export class AppModule {}
