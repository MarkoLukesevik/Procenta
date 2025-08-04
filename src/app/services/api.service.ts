import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, switchMap } from 'rxjs';

import SignInRegisterResponse from '../responses/sign-in-register-response';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private baseurl: string = 'https://procenta-api.k8s.nerathos.xyz/';
  private isRefreshingToken: boolean = false;

  private getAuthHeaders(): HttpHeaders {
    const token: string | null = localStorage.getItem('accessToken');
    let headers: HttpHeaders = new HttpHeaders();

    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    return headers;
  }

  private refreshTokenIfExpired(): Observable<SignInRegisterResponse | null> {
    const token: string | null = window.localStorage.getItem('refreshToken');
    const tokenExpiresAt: number | null = JSON.parse(
      localStorage.getItem('tokenExpiresAt') || '0',
    );
    const currentTimestamp: number = new Date().getTime() + 100 * 1000;

    if (
      token &&
      tokenExpiresAt &&
      tokenExpiresAt < currentTimestamp &&
      !this.isRefreshingToken
    ) {
      this.isRefreshingToken = true;
      return this.post<SignInRegisterResponse>('refresh-token', {
        accessToken: token,
      }).pipe(
        switchMap(
          (res: SignInRegisterResponse): Observable<SignInRegisterResponse> => {
            window.localStorage.setItem(
              'accountType',
              JSON.stringify(res.type),
            );
            window.localStorage.setItem('accessToken', res.accessToken);
            window.localStorage.setItem('accountId', res.id);
            window.localStorage.setItem(
              'tokenExpiresAt',
              JSON.stringify(res.expiresAt),
            );
            this.isRefreshingToken = false;
            return of(res);
          },
        ),
        catchError((): Observable<null> => {
          this.isRefreshingToken = false;
          return of(null);
        }),
      );
    }

    return of(null);
  }

  get<T>(url: string, withAuth = false): Observable<T> {
    return this.refreshTokenIfExpired().pipe(
      switchMap((): Observable<T> => {
        const options = withAuth ? { headers: this.getAuthHeaders() } : {};
        return this.http.get<T>(this.baseurl + url, options);
      }),
    );
  }

  post<T>(url: string, body: any, withAuth = true): Observable<T> {
    return this.refreshTokenIfExpired().pipe(
      switchMap((): Observable<T> => {
        const options = withAuth ? { headers: this.getAuthHeaders() } : {};
        return this.http.post<T>(this.baseurl + url, body, options);
      }),
    );
  }

  put<T>(url: string, body: any, withAuth = true): Observable<T> {
    return this.refreshTokenIfExpired().pipe(
      switchMap((): Observable<T> => {
        const options = withAuth ? { headers: this.getAuthHeaders() } : {};
        return this.http.put<T>(this.baseurl + url, body, options);
      }),
    );
  }

  patch<T>(url: string, body: any, withAuth = true): Observable<T> {
    return this.refreshTokenIfExpired().pipe(
      switchMap((): Observable<T> => {
        const options = withAuth ? { headers: this.getAuthHeaders() } : {};
        return this.http.patch<T>(this.baseurl + url, body, options);
      }),
    );
  }

  delete<T>(url: string, withAuth = true): Observable<T> {
    return this.refreshTokenIfExpired().pipe(
      switchMap((): Observable<T> => {
        const options = withAuth ? { headers: this.getAuthHeaders() } : {};
        return this.http.delete<T>(this.baseurl + url, options);
      }),
    );
  }
}
