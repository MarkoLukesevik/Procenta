import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  public readonly isWarmingUp: WritableSignal<boolean> = signal<boolean>(false);

  private activeRequests: number = 0;
  private warmupTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly warmupDelayMs: number = 4000;

  public start(): void {
    this.activeRequests++;

    if (this.activeRequests === 1 && this.warmupTimer === null) {
      this.warmupTimer = setTimeout((): void => {
        if (this.activeRequests > 0) this.isWarmingUp.set(true);
      }, this.warmupDelayMs);
    }
  }

  public stop(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);

    if (this.activeRequests === 0) {
      if (this.warmupTimer !== null) {
        clearTimeout(this.warmupTimer);
        this.warmupTimer = null;
      }
      this.isWarmingUp.set(false);
    }
  }
}
