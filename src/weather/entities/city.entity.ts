import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CityResponseObject } from '../interfaces/city-ro.interface';

@Entity('cities')
export class CityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  country: string;

  @Column('float')
  lon: number;

  @Column('float')
  lat: number;

  toResponseInterface(): CityResponseObject {
    const { id, name, country } = this;

    return { id, name, country };
  }
}
