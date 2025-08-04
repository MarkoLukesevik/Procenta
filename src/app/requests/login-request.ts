import { AccountType } from '../responses/sign-in-register-response';

export default interface LoginRequest {
  email: string;
  password: string;
  rememberLogin: boolean;
  type: AccountType;
}
