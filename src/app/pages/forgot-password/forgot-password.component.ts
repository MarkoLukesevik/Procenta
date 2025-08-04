import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { BaseInputComponent } from '../../base-components/base-input/base-input.component';

import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../services/language.service';
import { SignInRegisterService } from '../../services/sign-in-register.service';

@Component({
  selector: 'app-forgot-password',
  imports: [BaseInputComponent, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private languageService: LanguageService = inject(LanguageService);
  private signInRegisterService: SignInRegisterService = inject(
    SignInRegisterService,
  );
  private toastService: ToastrService = inject(ToastrService);

  public isSendEmailButtonSpinnerOn: boolean = false;

  public message: string = '';
  public email: string = '';
  public emailError: string = '';

  public t(key: string): string {
    return this.languageService.translate(key);
  }

  public handleSendEmailClick(): void {
    if (this.isSendEmailButtonSpinnerOn) return;

    this.validateEmail();
    if (this.emailError) return;

    this.isSendEmailButtonSpinnerOn = true;

    this.signInRegisterService.forgotPassword(this.email).subscribe({
      next: (): void => {
        this.message = this.t('you_will_receive_email_to_reset_password');
        this.isSendEmailButtonSpinnerOn = false;
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isSendEmailButtonSpinnerOn = false;
      },
    });
  }

  private validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email)) {
      this.emailError = this.t('invalid_email_format');
      return false;
    }

    this.emailError = '';
    return true;
  }
}
