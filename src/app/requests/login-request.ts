import { AccountType } from '../responses/auth-response';

export default interface LoginRequest {
  email: string;
  password: string;
  rememberLogin: boolean;
  type: AccountType;
}
