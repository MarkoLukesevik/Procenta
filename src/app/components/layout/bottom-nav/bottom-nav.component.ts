import { Component, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { LokalsService } from '../../../services/lokals.service';

import { User } from '../../../models/user';
import { Lokal } from '../../../models/lokal';

@Component({
  selector: 'app-bottom-nav',
  imports: [CommonModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent {
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private lokalsService: LokalsService = inject(LokalsService);

  public loggedInUser: Signal<User | null>;
  public loggedInLokal: Signal<Lokal | null>;

  constructor() {
    this.loggedInUser = this.userService.getLoggedInUser();
    this.loggedInLokal = this.lokalsService.getLoggedInLokal();
  }

  public async handleLinkClick(route: string): Promise<void> {
    await this.router.navigateByUrl(route);
  }

  public isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  public isQrCodeButtonVisible(): boolean {
    return (
      !!(
        this.loggedInUser() &&
        this.loggedInUser()?.qrCode &&
        this.loggedInUser()?.lokalId
      ) || !!this.loggedInLokal()
    );
  }

  public getProfilePicture(): string {
    const profilePhoto = this.loggedInUser()?.profilePhoto;

    if (profilePhoto) return profilePhoto;
    else return '';
  }

  public getLokalImage(): string {
    const lokalPhoto = this.loggedInLokal()?.image;
    if (lokalPhoto) return lokalPhoto;
    else return '';
  }
}
