import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  Delete,
  Put,
} from '@nestjs/common';

import { AuthGuard } from 'src/shared/auth.guard';
import { SubscriptionService } from './subscription.service';
import { User } from 'src/user/user.decorator';
import { SubscriptionDTO } from './dto/create-subscription.dto';
import { SubscriptionResponseObject } from './interfaces/subscription-ro.interface';

@Controller('api/subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get()
  @UseGuards(new AuthGuard())
  getAllSubscriptions(@User('id') userId: string) {
    return this.subscriptionService.getAllByUserId(userId);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createSubscription(
    @User('id') userId: string,
    @Body() body: SubscriptionDTO,
  ): Promise<SubscriptionResponseObject> {
    return this.subscriptionService.create(userId, body);
  }

  @Get(':id')
  @UseGuards(new AuthGuard())
  readSubscription(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<SubscriptionResponseObject> {
    return this.subscriptionService.read(id, userId);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateSubscription(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() body: Partial<SubscriptionDTO>,
  ): Promise<SubscriptionResponseObject> {
    return this.subscriptionService.update(id, userId, body);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroySubscription(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<SubscriptionResponseObject> {
    return this.subscriptionService.destroy(id, userId);
  }
}
