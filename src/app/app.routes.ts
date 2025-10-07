import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { LokalDetailsPageComponent } from './pages/lokal-details-page/lokal-details-page.component';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';
import { SignRegisterPageComponent } from './pages/sign-register-page/sign-register-page.component';
import { QrcodePageComponent } from './pages/qrcode-page/qrcode-page.component';
import { AdminPageComponent } from './admin-pages/admin-page/admin-page.component';
import { AdminEditUserPageComponent } from './admin-pages/admin-edit-user-page/admin-edit-user-page.component';
import { AdminEditLokalPageComponent } from './admin-pages/admin-edit-lokal-page/admin-edit-lokal-page.component';
import { VerifyEmailPageComponent } from './pages/verify-email-page/verify-email-page.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'about', component: AboutUsPageComponent },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [AuthGuard],
  },
  { path: 'lokal/:id', component: LokalDetailsPageComponent },
  {
    path: 'statistics',
    component: StatisticsPageComponent,
    canActivate: [AuthGuard],
  },
  { path: 'sign-in', component: SignRegisterPageComponent },
  { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
  { path: 'qrcode', component: QrcodePageComponent, canActivate: [AuthGuard] },
  { path: 'verify-account/:id', component: VerifyEmailPageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:id', component: ResetPasswordComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'admin-edit-user/:id', component: AdminEditUserPageComponent },
  { path: 'admin-edit-lokal/:id', component: AdminEditLokalPageComponent },
  { path: '**', redirectTo: 'home' },
];
