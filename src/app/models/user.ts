import { Status } from './enums/status';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  email: string;
  password: string;
  profilePhoto?: string;
  country?: string;
  qrCode: string;
  wantsToBeShown: boolean;
  phoneNumber?: number;
  lokalName?: string;
  lokalId?: string;
  gender?: UserGender;
  dateOfBirth?: string;
  isAdmin: boolean;
  status: Status;
  isVerified: boolean;
}

export enum UserGender {
  Male = 'Male',
  Female = 'Female',
}
