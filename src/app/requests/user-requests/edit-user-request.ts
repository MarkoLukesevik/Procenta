import { Status } from '../../models/enums/status';
import { UserGender } from '../../models/user';

export interface EditUserRequest {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  email: string;
  password: string;
  profilePhoto?: PhotoRequest;
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

export interface PhotoRequest {
  name: string | null;
  payload: string | null;
  imageUrl: string | null;
}
