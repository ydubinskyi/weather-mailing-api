import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  Column,
  Index,
  BeforeInsert,
} from 'typeorm';
import { CityEntity } from './city.entity';

@Entity('forecasts')
export class ForecastEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  minTemparetureK: number;

  @Column('text')
  maxTemparetureK: number;

  @Column('text')
  minTemparetureC: number;

  @Column('text')
  maxTemparetureC: number;

  @Column('text')
  minTemparetureFr: number;

  @Column('text')
  maxTemparetureFr: number;

  @Column('text')
  pressure: number;

  @Column('text')
  humidity: number;

  @Column('text')
  weather: string;

  @Index({ unique: true })
  @ManyToOne(type => CityEntity, city => city.id)
  city: CityEntity;

  @BeforeInsert()
  convertTemparature() {
    this.maxTemparetureC = this.convertKelvinToCelsius(this.maxTemparetureK);
    this.minTemparetureC = this.convertKelvinToCelsius(this.minTemparetureK);

    this.maxTemparetureFr = this.convertKelvinToFahrenheit(
      this.maxTemparetureK,
    );
    this.minTemparetureFr = this.convertKelvinToFahrenheit(
      this.minTemparetureK,
    );
  }

  private convertKelvinToCelsius(temp: number): number {
    return temp - 273.15;
  }

  private convertKelvinToFahrenheit(temp: number): number {
    return temp * 1.8 - 459.67;
  }
}
