import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubscriptionEntity } from './subscription.entity';
import { SubscriptionDTO } from './dto/create-subscription.dto';
import { UserEntity } from 'src/user/user.entity';
import { SubscriptionResponseObject } from './interfaces/subscription-ro.interface';
import { CityEntity } from 'src/weather/entities/city.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CityEntity)
    private cityRepository: Repository<CityEntity>,
  ) {}

  async getAll() {
    const subscriptions = await this.subscriptionRepository.find({
      relations: ['author', 'city'],
    });

    return subscriptions.map(sub => sub.toResponseObject());
  }

  async getAllByUserId(userId: string) {
    const subscriptions = await this.subscriptionRepository.find({
      relations: ['author', 'city'],
      where: {
        author: {
          id: userId,
        },
      },
    });

    return subscriptions.map(sub => sub.toResponseObject());
  }

  async create(
    userId: string,
    data: SubscriptionDTO,
  ): Promise<SubscriptionResponseObject> {
    const author = await this.userRepository.findOne(userId);
    const city = await this.cityRepository.findOne(data.city);
    const newSub = await this.subscriptionRepository.create({
      ...data,
      city,
      author,
    });
    await this.subscriptionRepository.save(newSub);

    return newSub.toResponseObject();
  }

  async read(id: string, userId: string): Promise<SubscriptionResponseObject> {
    const sub = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['author', 'city'],
    });

    if (!sub) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(sub, userId);

    return sub.toResponseObject();
  }

  async update(
    id: string,
    userId: string,
    data: Partial<SubscriptionDTO>,
  ): Promise<SubscriptionResponseObject> {
    let sub = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['author', 'city'],
    });
    const city = await this.cityRepository.findOne(data.city);

    if (!sub) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(sub, userId);

    const updateData = {
      ...data,
      city,
    };

    await this.subscriptionRepository.update(id, updateData);

    sub = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['author', 'city'],
    });

    return sub.toResponseObject();
  }

  async destroy(
    id: string,
    userId: string,
  ): Promise<SubscriptionResponseObject> {
    const sub = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['author', 'city'],
    });

    if (!sub) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(sub, userId);

    await this.subscriptionRepository.delete(id);

    return sub.toResponseObject();
  }

  private ensureOwnership(sub: SubscriptionEntity, userId: string): void {
    if (sub.author.id !== userId) {
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
    }
  }
}
