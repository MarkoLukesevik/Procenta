import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Platform } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

import { UserService } from './services/user.service';
import { LokalsService } from './services/lokals.service';
import { ToastrService } from 'ngx-toastr';

import { User } from './models/user';
import { Lokal } from './models/lokal';
import { AccountType } from './responses/sign-in-register-response';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, BottomNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private lokalsService: LokalsService = inject(LokalsService);
  private toastService: ToastrService = inject(ToastrService);
  private platform: Platform = inject(Platform);

  constructor() {
    this.setupKeyboardListeners();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((): void => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  async ngOnInit(): Promise<void> {
    await this.platform.ready();

    if (
      !this.platform.is('mobileweb') &&
      (this.platform.is('ios') || this.platform.is('android'))
    ) {
      try {
        await ScreenOrientation.lock({ orientation: 'portrait' });
      } catch (err) {
        console.warn('Screen orientation lock failed:', err);
      }
    }

    let accountType: string | null =
      window.localStorage.getItem('accountType') ||
      window.sessionStorage.getItem('accountType');

    const accountId: string | null =
      window.localStorage.getItem('accountId') ||
      window.sessionStorage.getItem('accountId');

    if (accountType && accountId) {
      accountType = JSON.parse(accountType) as AccountType;

      if ((accountType as AccountType) === AccountType.User) {
        this.userService.getUser(accountId).subscribe({
          next: (user: User): void => {
            this.userService.setLoggedInUser(user);
          },
          error: (httpErrorResponse: HttpErrorResponse): void => {
            this.toastService.error(httpErrorResponse.error);
          },
        });
      } else if ((accountType as AccountType) === AccountType.Lokal) {
        this.lokalsService.getLokal(accountId).subscribe({
          next: (lokal: Lokal): void => {
            this.lokalsService.setLoggedInLokal(lokal);
          },
          error: (httpErrorResponse: HttpErrorResponse): void => {
            this.toastService.error(httpErrorResponse.error);
          },
        });
      }
    }
  }

  private setupKeyboardListeners() {
    if (
      Capacitor.isNativePlatform() &&
      (this.platform.is('ios') || this.platform.is('android'))
    ) {
      Keyboard.addListener('keyboardWillShow', (info: any) => {
        document.body.classList.add('keyboard-visible');
        document.documentElement.style.setProperty(
          '--keyboard-height',
          `${info.keyboardHeight}px`,
        );
      });

      Keyboard.addListener('keyboardWillHide', () => {
        document.body.classList.remove('keyboard-visible');
        document.documentElement.style.setProperty('--keyboard-height', '0px');
      });
    }
  }
}
