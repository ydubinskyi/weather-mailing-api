import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from 'src/subscription/subscription.entity';
import { Repository } from 'typeorm';
import { WeatherService } from 'src/weather/weather.service';
import { ForecastEntity } from 'src/weather/entities/forecast.entity';

@Injectable()
export class MailingService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,
    private weatherService: WeatherService,
  ) {}

  async sendMails(): Promise<void> {
    const subs = await this.subscriptionRepository.find({
      relations: ['author', 'city'],
      order: {
        city: 1,
      },
    });

    for (const sub of subs) {
      const forecast = await this.weatherService.findOrCreateForecast(
        sub.city.id,
      );

      this.sendMail(sub.email, sub.author.name, forecast);
    }
  }

  private sendMail(email: string, receiver: string, content: ForecastEntity) {
    // send mail to user
  }
}
