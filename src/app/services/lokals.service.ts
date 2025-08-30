import { Injectable, Signal, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Lokal } from '../models/lokal';
import { EditLokalRequest } from '../requests/lokal-requests/edit-lokal-request';
import StatisticsResponse from '../responses/statistics';

@Injectable({
  providedIn: 'root',
})
export class LokalsService {
  private apiService = inject(ApiService);

  private lokals = signal<Lokal[]>([]);
  private loggedInLokal = signal<Lokal | null>(null);

  public setLokals(lokals: Lokal[]): void {
    this.lokals.set(lokals);
  }

  public getLoggedInLokal(): Signal<Lokal | null> {
    return this.loggedInLokal;
  }

  public setLoggedInLokal(lokal: Lokal): void {
    this.loggedInLokal.set(lokal);
  }

  public removeLoggedInLokal(): void {
    this.loggedInLokal.set(null);
  }

  public getLokals(): Observable<Lokal[]> {
    return this.apiService.get<Lokal[]>('lokals');
  }

  public getLokal(id: string): Observable<Lokal> {
    return this.apiService.get<Lokal>(`lokals/${id}`);
  }

  public editLokal(lokal: EditLokalRequest): Observable<Lokal> {
    return this.apiService.put<Lokal>(`lokals/${lokal.id}`, lokal);
  }

  public deleteLokal(lokal: Lokal): Observable<Lokal> {
    return this.apiService.delete<Lokal>(`lokals/${lokal.id}`);
  }

  public getStatistics(lokalId: string): Observable<StatisticsResponse> {
    return this.apiService.get<StatisticsResponse>(
      `lokals/${lokalId}/statistics`,
      true,
    );
  }
}
