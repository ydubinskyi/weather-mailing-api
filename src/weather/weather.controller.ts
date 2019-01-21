import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { WeatherService } from './weather.service';
import { AuthGuard } from 'src/shared/auth.guard';

@Controller('api/weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get('load-cities-from-file')
  loadCities() {
    return this.weatherService.loadCitiesList();
  }

  @Get('cities')
  @UseGuards(new AuthGuard())
  searchCities(@Query('search') query: string) {
    return this.weatherService.searchCities(query);
  }

  @Get('get-forecast')
  testForecast() {
    return this.weatherService.findOrCreateForecast('878676');
  }
}
