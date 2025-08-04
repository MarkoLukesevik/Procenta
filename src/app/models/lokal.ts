import { User } from './user';
import { Status } from './enums/status';

export interface Lokal {
  id: string;
  name: string;
  description: string;
  location: string;
  country: string;
  phoneNumber: number;
  lokalType: LokalType;
  url: string;
  facebookUrl: string;
  instagramUrl: string;
  email: string;
  password: string;
  image?: string;
  additionalImages: string[];
  employees: User[];
  createdAt: Date;
  hasActiveSubscription: boolean;
  status: Status;
  isVerified: boolean;
  isRecommended: boolean;
  isPopular: boolean;
}

export enum LokalType {
  Restaurant = 'Restaurant',
  Bar = 'Bar',
  CoffeeShop = 'Coffee_Shop',
}
