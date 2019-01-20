import { UserResponseObject } from 'src/user/interfaces/user-ro.interface';

export interface SubscriptionResponseObject {
  created: Date;
  updated: Date;
  email: string;
  city: string;
  author?: UserResponseObject;
}
