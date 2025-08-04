import { LokalType } from '../../models/lokal';
import { Status } from '../../models/enums/status';
import { PhotoRequest } from '../user-requests/edit-user-request';

export interface EditLokalRequest {
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
  image?: PhotoRequest;
  additionalImages: PhotoRequest[];
  employees: string[];
  createdAt: Date;
  hasActiveSubscription: boolean;
  status: Status;
}
