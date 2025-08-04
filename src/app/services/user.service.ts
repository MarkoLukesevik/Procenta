import { Injectable, Signal, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user';
import { EditUserRequest } from '../requests/user-requests/edit-user-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService);

  private loggedInUser = signal<User | null>(null);

  public getLoggedInUser(): Signal<User | null> {
    return this.loggedInUser;
  }

  public setLoggedInUser(user: User): void {
    this.loggedInUser.set(user);
  }

  public removeLoggedInUser(): void {
    this.loggedInUser.set(null);
  }

  public getUser(id: string): Observable<User> {
    return this.apiService.get<User>(`users/${id}`);
  }

  public getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(`users`);
  }

  public editUser(user: EditUserRequest): Observable<User> {
    return this.apiService.put<User>(`users/${user.id}`, user);
  }

  public deleteUser(user: User): Observable<User> {
    return this.apiService.delete<User>(`users/${user.id}`);
  }
}
