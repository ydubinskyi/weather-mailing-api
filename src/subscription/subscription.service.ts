import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubscriptionEntity } from './subscription.entity';
import { SubscriptionDTO } from './dto/create-subscription.dto';
import { UserEntity } from 'src/user/user.entity';
import { SubscriptionResponseObject } from './interfaces/subscription-ro.interface';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getAll() {
    const subscriptions = await this.subscriptionRepository.find({
      relations: ['author'],
    });

    return subscriptions.map(sub => sub.toResponseObject());
  }

  async getAllByUserId(userId: string) {
    const subscriptions = await this.subscriptionRepository.find({
      relations: ['author'],
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
    const user = await this.userRepository.findOne(userId);
    const newSub = await this.subscriptionRepository.create({
      ...data,
      author: user,
    });
    await this.subscriptionRepository.save(newSub);

    return newSub.toResponseObject();
  }

  async read(id: string, userId: string): Promise<SubscriptionResponseObject> {
    const sub = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['author'],
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
      relations: ['author'],
    });

    if (!sub) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(sub, userId);

    await this.subscriptionRepository.update(id, data);

    sub = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    return sub.toResponseObject();
  }

  async destroy(
    id: string,
    userId: string,
  ): Promise<SubscriptionResponseObject> {
    const sub = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['author'],
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
