import { Controller, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('api/weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get('load-cities-from-file')
  loadCities() {
    return this.weatherService.loadCitiesList();
  }
}
