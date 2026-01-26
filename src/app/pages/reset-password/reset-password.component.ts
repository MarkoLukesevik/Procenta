import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseInputComponent } from '../../components/base/base-input/base-input.component';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth-service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, BaseInputComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private authService: AuthService = inject(AuthService);
  private languageService: LanguageService = inject(LanguageService);
  private toastService: ToastrService = inject(ToastrService);

  public isSubmitButtonSpinnerOn: boolean = false;

  public password: string = '';
  public confirmPassword: string = '';

  public passwordError: string = '';

  private tokenId: string = '';

  async ngOnInit(): Promise<void> {
    const tokenId: string | null = this.route.snapshot.paramMap.get('id');

    if (tokenId) {
      this.tokenId = tokenId;
    } else {
      await this.router.navigate(['/sign-in']);
    }
  }

  public t(key: string): string {
    return this.languageService.translate(key);
  }

  public handleSubmitClick() {
    if (this.isSubmitButtonSpinnerOn) return;
    this.isSubmitButtonSpinnerOn = true;

    this.validatePassword();
    if (this.passwordError) return;

    this.authService.resetPassword(this.password, this.tokenId).subscribe({
      next: () => {
        this.toastService.success(this.t('password_reset_successfully'));
        setTimeout(async (): Promise<void> => {
          await this.router.navigate(['/sign-in']);
        }, 1000);
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isSubmitButtonSpinnerOn = false;
      },
    });
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
}
