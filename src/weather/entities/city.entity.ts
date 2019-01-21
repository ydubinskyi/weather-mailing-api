import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { CityResponseObject } from '../interfaces/city-ro.interface';

@Entity('cities')
export class CityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  name: string;

  @Column('text')
  country: string;

  @Column('float')
  lon: number;

  @Column('float')
  lat: number;

  toResponseObject(): CityResponseObject {
    const { id, name, country, lon, lat } = this;

    return { id, name, country, lon, lat };
  }
}
