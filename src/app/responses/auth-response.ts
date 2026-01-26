export default interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
  type: AccountType;
  expiresAt: number;
}

export enum AccountType {
  User = 'User',
  Lokal = 'Lokal',
}
