import { Component, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { LokalsService } from '../../services/lokals.service';
import { LanguageService } from '../../services/language.service';

import { User } from '../../models/user';
import { Lokal } from '../../models/lokal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [CommonModule, FormsModule],
})
export class HeaderComponent {
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private lokalService: LokalsService = inject(LokalsService);
  private languageService: LanguageService = inject(LanguageService);

  public loggedInUser: Signal<User | null>;
  public loggedInLokal: Signal<Lokal | null>;

  constructor() {
    this.loggedInUser = this.userService.getLoggedInUser();
    this.loggedInLokal = this.lokalService.getLoggedInLokal();
  }

  public t(key: string): string {
    return this.languageService.translate(key);
  }

  public async handleLinkClick(route: string): Promise<void> {
    await this.router.navigateByUrl(route);
  }

  public async handleLogoClick(): Promise<void> {
    await this.router.navigateByUrl('home');
  }

  public async handleProfileClick(): Promise<void> {
    await this.router.navigateByUrl('profile');
  }

  public isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
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
