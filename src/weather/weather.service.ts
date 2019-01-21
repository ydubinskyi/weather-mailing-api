import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';

import { CityEntity } from './entities/city.entity';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(CityEntity)
    private cityRepository: Repository<CityEntity>,
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

    return true;
  }
}
