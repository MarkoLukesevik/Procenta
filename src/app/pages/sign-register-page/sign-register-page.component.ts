import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { BaseInputComponent } from '../../base-components/base-input/base-input.component';
import { BaseCheckboxComponent } from '../../base-components/base-checkbox/base-checkbox.component';

import { ToastrService } from 'ngx-toastr';
import { SignInRegisterService } from '../../services/sign-in-register.service';
import { LokalsService } from '../../services/lokals.service';
import { UserService } from '../../services/user.service';
import { LanguageService } from '../../services/language.service';

import { User } from '../../models/user';
import { Lokal } from '../../models/lokal';

import RegisterUserRequest from '../../requests/user-requests/register-user-request';
import LoginRequest from '../../requests/login-request';
import RegisterLokalRequest from '../../requests/lokal-requests/register-lokal-request';

import SignInRegisterResponse, {
  AccountType,
} from '../../responses/sign-in-register-response';

@Component({
  selector: 'app-sign-register-page',
  imports: [CommonModule, BaseInputComponent, BaseCheckboxComponent],
  templateUrl: './sign-register-page.component.html',
  styleUrl: './sign-register-page.component.scss',
})
export class SignRegisterPageComponent {
  private userService: UserService = inject(UserService);
  private lokalService: LokalsService = inject(LokalsService);
  private signInRegisterService: SignInRegisterService = inject(
    SignInRegisterService,
  );
  private router: Router = inject(Router);
  private toastService: ToastrService = inject(ToastrService);
  private languageService: LanguageService = inject(LanguageService);

  public activeView: 'login' | 'register' = 'login';
  public accountType: AccountType = AccountType.User;

  public lokalName: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';

  public termsAgreed: boolean = false;
  public rememberLogin: boolean = false;

  public emailError: string = '';
  public passwordError: string = '';

  public isSignButtonSpinnerOn: boolean = false;

  public t(key: string): string {
    return this.languageService.translate(key);
  }

  // region ui logic
  public toggleActiveView() {
    this.resetUser();
    if (this.activeView === 'login') this.activeView = 'register';
    else this.activeView = 'login';
  }

  public handleAccountTypeChange(accountType: AccountType): void {
    this.accountType = accountType;
    this.resetUser();
  }

  public getPageTitle(): string {
    return this.activeView === 'register'
      ? this.t('create_account')
      : this.t('welcome_back');
  }

  public getPageSubTitle(): string {
    return this.activeView === 'register'
      ? this.t('please_enter_the_sign_up_information')
      : this.t('please_enter_the_sign_in_information');
  }

  public getSignButtonText(): string {
    return this.activeView === 'register'
      ? this.t('sign_up')
      : this.t('sign_in');
  }

  public getToggleViewButtonText(): string {
    return this.activeView === 'login' ? this.t('sign_up') : this.t('sign_in');
  }

  public getActiveViewToggleButtonText(): string {
    if (this.activeView === 'register')
      return this.t('already_have_an_account');
    return this.t('dont_have_an_account');
  }
  // endregion

  // region handlers
  public handleSignButtonClick(): void {
    if (this.activeView === 'register') this.handleRegister();
    else this.handleLogin();
  }

  private handleRegister(): void {
    this.validateEmail();
    this.validatePassword();

    if (this.emailError || this.passwordError) return;

    this.isSignButtonSpinnerOn = true;

    if (this.accountType === AccountType.User) {
      const request: RegisterUserRequest = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      };

      this.signInRegisterService.registerUser(request).subscribe({
        next: (res: SignInRegisterResponse): void => {
          this.handleSignInRegisterFinish(res);
        },
        error: (httpErrorResponse: HttpErrorResponse): void => {
          this.toastService.error(httpErrorResponse.error);
          this.isSignButtonSpinnerOn = false;
        },
      });
    } else {
      const request: RegisterLokalRequest = {
        name: this.lokalName,
        email: this.email,
        password: this.password,
      };
      this.signInRegisterService.registerLocal(request).subscribe({
        next: (res: SignInRegisterResponse): void => {
          this.handleSignInRegisterFinish(res);
        },
        error: (httpErrorResponse: HttpErrorResponse): void => {
          this.toastService.error(httpErrorResponse.error);
          this.isSignButtonSpinnerOn = false;
        },
      });
    }
  }

  private handleLogin(): void {
    this.isSignButtonSpinnerOn = true;

    const request: LoginRequest = {
      email: this.email,
      password: this.password,
      rememberLogin: this.rememberLogin,
      type: this.accountType,
    };

    this.signInRegisterService.login(request).subscribe({
      next: (res: SignInRegisterResponse): void => {
        this.handleSignInRegisterFinish(res);
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isSignButtonSpinnerOn = false;
      },
    });
  }

  private handleSignInRegisterFinish(res: SignInRegisterResponse): void {
    this.signInRegisterService.setAccountInfo(res, this.rememberLogin);

    if (res.type === AccountType.User) {
      this.userService.getUser(res.id).subscribe({
        next: async (user: User): Promise<void> => {
          this.userService.setLoggedInUser(user);
          this.isSignButtonSpinnerOn = false;
          await this.router.navigateByUrl('home');
        },
        error: (httpErrorResponse: HttpErrorResponse): void => {
          this.toastService.error(httpErrorResponse.error);
          this.isSignButtonSpinnerOn = false;
        },
      });
    } else {
      this.lokalService.getLokal(res.id).subscribe({
        next: async (lokal: Lokal): Promise<void> => {
          this.lokalService.setLoggedInLokal(lokal);
          this.isSignButtonSpinnerOn = false;
          await this.router.navigateByUrl('home');
        },
        error: (httpErrorResponse: HttpErrorResponse): void => {
          this.toastService.error(httpErrorResponse.error);
          this.isSignButtonSpinnerOn = false;
        },
      });
    }
  }

  private resetUser(): void {
    this.lokalName = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  public async handleForgotPasswordClick(): Promise<void> {
    await this.router.navigateByUrl('forgot-password');
  }
  // endregion

  public isSignButtonDisabled(): boolean {
    if (this.activeView === 'login')
      return !this.email || !this.password || this.isSignButtonSpinnerOn;
    else if (this.accountType === AccountType.User) {
      return (
        !this.firstName ||
        !this.lastName ||
        !this.email ||
        !this.password ||
        !this.confirmPassword ||
        !this.termsAgreed ||
        this.isSignButtonSpinnerOn
      );
    } else {
      return (
        !this.lokalName ||
        !this.email ||
        !this.password ||
        !this.confirmPassword ||
        !this.termsAgreed ||
        this.isSignButtonSpinnerOn
      );
    }
  }

  // region validation
  private validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email)) {
      this.emailError = this.t('invalid_email_format');
      return false;
    }

    this.emailError = '';
    return true;
  }

  private validatePassword(): boolean {
    if (this.password.length < 8) {
      this.passwordError = this.t('password_must_have_at_least_8_characters');
      return false;
    }

    if (!/\d/.test(this.password)) {
      this.passwordError = this.t('password_must_have_at_least_1_number');
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.passwordError = this.t('passwords_do_not_match');
      return false;
    }

    this.passwordError = '';
    return true;
  }
  // endregion
  protected readonly AccountType = AccountType;
}
