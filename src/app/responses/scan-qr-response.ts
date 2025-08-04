import { User } from '../models/user';

export interface QRCodeResponse {
  user: User;
  isEligible: boolean;
  reason: string;
}
