import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

import LoginRequest from '../requests/login-request';
import RegisterUserRequest from '../requests/user-requests/register-user-request';
import RegisterLokalRequest from '../requests/lokal-requests/register-lokal-request';
import AuthResponse from '../responses/auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);

  public setAccountInfo(info: AuthResponse, rememberLogin: boolean): void {
    if (rememberLogin) {
      window.localStorage.setItem('accountType', JSON.stringify(info.type));
      window.localStorage.setItem('accountId', info.id);
    } else {
      window.sessionStorage.setItem('accountType', JSON.stringify(info.type));
      window.sessionStorage.setItem('accountId', info.id);
    }

    window.localStorage.setItem('accessToken', info.accessToken);
    window.localStorage.setItem('refreshToken', info.refreshToken);
    window.localStorage.setItem(
      'tokenExpiresAt',
      JSON.stringify(info.expiresAt),
    );
  }

  public removeAccountInfo(): void {
    window.localStorage.removeItem('accountType');
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    window.localStorage.removeItem('accountId');
    window.localStorage.removeItem('tokenExpiresAt');

    window.sessionStorage.removeItem('accountType');
    window.sessionStorage.removeItem('accountId');
  }

  public login(request: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('login', request, false);
  }

  public registerUser(request: RegisterUserRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('users', request, false);
  }

  public registerLocal(
    request: RegisterLokalRequest,
  ): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('lokals', request, false);
  }

  public verifyAccount(id: string): Observable<void> {
    return this.apiService.post<void>('activate-account', { id: id });
  }

  public activeAccountByEmail(tokenId: string): Observable<void> {
    return this.apiService.get<void>('activate-account/' + tokenId, true);
  }

  public forgotPassword(email: string): Observable<void> {
    return this.apiService.post<void>(
      'forgot-password',
      { email: email },
      false,
    );
  }

  public resetPassword(password: string, tokenId: string): Observable<void> {
    return this.apiService.post<void>(
      'forgot-password/' + tokenId,
      { password: password },
      false,
    );
  }
}
