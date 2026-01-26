import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../services/auth-service';
import { LanguageService } from '../../services/language.service';
import { UserService } from '../../services/user.service';
import { LokalsService } from '../../services/lokals.service';
import { User } from '../../models/user';
import { Lokal } from '../../models/lokal';
import { AccountType } from '../../responses/auth-response';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-email-page',
  imports: [CommonModule],
  templateUrl: './verify-email-page.component.html',
  styleUrl: './verify-email-page.component.scss',
})
export class VerifyEmailPageComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private languageService: LanguageService = inject(LanguageService);
  private userService: UserService = inject(UserService);
  private lokalsService: LokalsService = inject(LokalsService);
  private toastService: ToastrService = inject(ToastrService);

  public pageMessage: string = '';
  public isVerified: boolean = false;

  private loggedInUser!: User | null;
  public loggedInLokal!: Lokal | null;

  async ngOnInit(): Promise<void> {
    let accountType: string | null = window.localStorage.getItem('accountType');
    const accountId: string | null = window.localStorage.getItem('accountId');

    if (accountType && accountId) {
      accountType = JSON.parse(accountType) as AccountType;

      if ((accountType as AccountType) === AccountType.User) {
        this.userService.getUser(accountId).subscribe({
          next: async (user: User): Promise<void> => {
            this.userService.setLoggedInUser(user);

            this.loggedInUser = this.userService.getLoggedInUser()();

            if (this.loggedInUser && this.loggedInUser.isVerified) {
              await this.router.navigate(['/home']);
            }

            await this.verifyAccount();
          },
          error: (httpErrorResponse: HttpErrorResponse): void => {
            this.toastService.error(httpErrorResponse.error);
          },
        });
      } else if ((accountType as AccountType) === AccountType.Lokal) {
        this.lokalsService.getLokal(accountId).subscribe({
          next: async (lokal: Lokal): Promise<void> => {
            this.lokalsService.setLoggedInLokal(lokal);

            this.loggedInLokal = this.lokalsService.getLoggedInLokal()();

            if (this.loggedInLokal && this.loggedInLokal.isVerified) {
              await this.router.navigate(['/home']);
            }

            await this.verifyAccount();
          },
          error: (httpErrorResponse: HttpErrorResponse): void => {
            this.toastService.error(httpErrorResponse.error);
          },
        });
      }
    }
  }

  private async verifyAccount(): Promise<void> {
    const tokenId: string | null = this.route.snapshot.paramMap.get('id');

    if (tokenId) {
      this.authService.activeAccountByEmail(tokenId).subscribe({
        next: async () => {
          this.isVerified = true;
          this.pageMessage = this.t('successfully_verified');

          if (this.loggedInUser) this.loggedInUser.isVerified = true;
          if (this.loggedInLokal) this.loggedInLokal.isVerified = true;
        },
        error: (): void => {
          this.isVerified = false;
          this.pageMessage = this.t('successfully_unverified');
        },
      });
    } else {
      await this.router.navigate(['/home']);
    }
  }

  public t(key: string): string {
    return this.languageService.translate(key);
  }

  public async handleHomeClick(): Promise<void> {
    await this.router.navigate(['/home']);
  }
}
