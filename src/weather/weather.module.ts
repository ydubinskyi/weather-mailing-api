import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { CityEntity } from './entities/city.entity';
import { ForecastEntity } from './entities/forecast.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([CityEntity, ForecastEntity])],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
