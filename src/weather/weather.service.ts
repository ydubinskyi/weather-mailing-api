import { Injectable, HttpService } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { map } from 'rxjs/operators';

import { CityEntity } from './entities/city.entity';
import { CityResponseObject } from './interfaces/city-ro.interface';
import { ForecastEntity } from './entities/forecast.entity';
import { OWMForecastApiResponse } from './interfaces/owm-forecast.interface';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(CityEntity)
    private cityRepository: Repository<CityEntity>,
    @InjectRepository(ForecastEntity)
    private forecastRepository: Repository<ForecastEntity>,
    private http: HttpService,
  ) {}

  async loadCitiesList() {
    const rawData: any = readFileSync('./public/city.list.json');

    const cities = JSON.parse(rawData);

    const mappedCities = cities.map(city => ({
      id: city.id,
      name: city.name,
      country: city.country,
      lon: city.coord.lon,
      lat: city.coord.lat,
    }));

    await this.cityRepository.insert(mappedCities, {
      chunk: mappedCities.length / 10000,
      transaction: false,
    });
  }

  async searchCities(
    searchString: string,
    limit: number = 10,
  ): Promise<CityResponseObject[]> {
    const cities = await this.cityRepository.find({
      where: {
        name: Like(`%${searchString}%`),
      },
      take: limit,
    });

    if (cities) {
      return cities.map(city => city.toResponseObject());
    } else {
      return [];
    }
  }

  async findOrCreateForecast(cityId: string) {
    const city = await this.cityRepository.findOne(cityId);
    const forecast = await this.forecastRepository.findOne({
      where: {
        city,
      },
      relations: ['city'],
    });

    if (forecast) {
      const today = new Date().setHours(0, 0, 0, 0);

      if (forecast.updated.setHours(0, 0, 0, 0) === today) {
        return forecast;
      } else {
        const forecastData = await this.fetchForecast(cityId);
        const weatherData = this.mapWeatherObject(forecastData);

        const updatedForecast = this.forecastRepository.create({
          ...weatherData,
          city,
        });

        await this.forecastRepository.update(forecast.id, updatedForecast);

        return await this.forecastRepository.findOne(forecast.id, {
          relations: ['city'],
        });
      }
    } else {
      const forecastData = await this.fetchForecast(cityId);
      const weatherData = this.mapWeatherObject(forecastData);

      const createdForecast = this.forecastRepository.create({
        ...weatherData,
        city,
      });

      await this.forecastRepository.save(createdForecast);

      return createdForecast;
    }
  }

  private async fetchForecast(cityId: string) {
    const API_KEY = process.env.WEATHER_KEY;
    const forecast = await this.http
      .get<OWMForecastApiResponse>(
        `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&APPID=${API_KEY}`,
      )
      .pipe(map(response => response.data))
      .toPromise();

    return forecast;
  }

  private mapWeatherObject(
    forecastResponse: OWMForecastApiResponse,
  ): Partial<ForecastEntity> {
    const tomorrowForecast = forecastResponse.list.find(item => {
      const itemDate = new Date(item.dt_txt);
      const tommorowDate = new Date();
      tommorowDate.setDate(tommorowDate.getDate() + 1);
      return (
        itemDate.setHours(0, 0, 0, 0) === tommorowDate.setHours(0, 0, 0, 0)
      );
    });

    const forecastObj = {
      minTemparetureK: tomorrowForecast.main.temp_min,
      maxTemparetureK: tomorrowForecast.main.temp_max,
      pressure: tomorrowForecast.main.pressure,
      humidity: tomorrowForecast.main.humidity,
      weather: tomorrowForecast.weather[0].main,
    };

    return forecastObj;
  }
}
