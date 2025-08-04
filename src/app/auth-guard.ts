import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { LokalsService } from './services/lokals.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private userService = inject(UserService);
  private lokalService = inject(LokalsService);
  private router = inject(Router);


  public canActivate(): boolean {
    const user = this.userService.getLoggedInUser();
    const lokal = this.lokalService.getLoggedInLokal();

    if (user() || lokal()) {
      return true;
    } else {
      this.router.navigate(['/home']).then((): void => {});
      return false;
    }
  }
}
