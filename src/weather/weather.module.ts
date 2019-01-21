import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { CityEntity } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity])],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
