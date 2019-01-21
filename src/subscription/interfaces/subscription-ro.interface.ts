import { UserResponseObject } from 'src/user/interfaces/user-ro.interface';
import { CityResponseObject } from 'src/weather/interfaces/city-ro.interface';

export interface SubscriptionResponseObject {
  id?: string;
  created: Date;
  updated: Date;
  email: string;
  city?: CityResponseObject;
  author?: UserResponseObject;
}
