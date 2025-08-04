import { Injectable, inject } from '@angular/core';
import { User } from '../models/user';
import { Lokal } from '../models/lokal';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Status } from '../models/enums/status';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiService = inject(ApiService);


  public deleteUser(user: User): Observable<User> {
    return this.apiService.delete<User>(`users/${user.id}`);
  }

  public deleteLokal(lokal: Lokal): Observable<Lokal> {
    return this.apiService.delete<Lokal>(`lokals/${lokal.id}`);
  }

  public updateStatus(id: string, status: Status): Observable<void> {
    return this.apiService.patch<void>(`update-status`, {
      id: id,
      status: status,
    });
  }

  public updateSubscription(
    id: string,
    hasActiveSubscription: boolean,
  ): Observable<void> {
    return this.apiService.patch<void>(`update-subscription`, {
      id: id,
      hasActiveSubscription: hasActiveSubscription,
    });
  }

  public editLokalIsPopular(id: string, isPopular: boolean): Observable<void> {
    return this.apiService.patch<void>(`lokals/set-popular`, {
      id: id,
      isPopular: isPopular,
    });
  }

  public editLokalIsRecommended(
    id: string,
    isRecommended: boolean,
  ): Observable<void> {
    return this.apiService.patch<void>(`lokals/set-recommended`, {
      id: id,
      isRecommended: isRecommended,
    });
  }
}
