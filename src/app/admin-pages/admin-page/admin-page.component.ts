import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { BaseInputComponent } from '../../base-components/base-input/base-input.component';

import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { LokalsService } from '../../services/lokals.service';
import { AdminService } from '../../services/admin.service';

import { Status } from '../../models/enums/status';
import { User } from '../../models/user';
import { Lokal } from '../../models/lokal';

@Component({
  selector: 'app-admin-page',
  imports: [CommonModule, BaseInputComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent implements OnInit {
  private userService = inject(UserService);
  private lokalService = inject(LokalsService);
  private toastService = inject(ToastrService);
  private adminService = inject(AdminService);
  private router = inject(Router);

  public lokals: Lokal[] = [];
  public users: User[] = [];

  public filteredUsers: User[] = [];
  public filteredLokals: Lokal[] = [];

  public usersSearchKey: string = '';
  public lokalsSearchKey: string = '';

  private loggedInUser: User | null = null;

  public isButtonSpinnerOn: boolean = false;
  isPageLoading: boolean = false;

  async ngOnInit(): Promise<void> {
    this.isPageLoading = true;
    const accountId: string | null = window.localStorage.getItem('accountId');
    if (accountId) {
      this.userService.getUser(accountId).subscribe({
        next: async (user: User): Promise<void> => {
          this.userService.setLoggedInUser(user);
          this.loggedInUser = this.userService.getLoggedInUser()();

          if (!this.loggedInUser?.isAdmin) {
            await this.router.navigate(['home']);
          }
          this.getAllUsersAndLokals();
        },
        error: async (httpErrorResponse: HttpErrorResponse): Promise<void> => {
          this.toastService.error(httpErrorResponse.error);
          await this.router.navigate(['home']);
        },
      });
    } else {
      await this.router.navigate(['home']);
    }
  }

  private getAllUsersAndLokals(): void {
    this.isPageLoading = true;
    this.lokalService.getLokals().subscribe({
      next: (lokals: Lokal[]) => {
        this.lokals = lokals;
        this.filteredLokals = lokals;
        this.isPageLoading = false;
      },
      error: (httpErrorResponse: HttpErrorResponse) => {
        this.toastService.error(httpErrorResponse.error);
        this.isPageLoading = false;
      },
    });

    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.filteredUsers = users;
        this.isPageLoading = false;
      },
      error: (httpErrorResponse: HttpErrorResponse) => {
        this.toastService.error(httpErrorResponse.error);
        this.isPageLoading = false;
      },
    });
  }

  // region ui formatters
  public getSubscriptionText(lokal: Lokal): string {
    return lokal.hasActiveSubscription ? 'Active' : 'Inactive';
  }

  public getLokalStatusText(lokal: Lokal): string {
    if (lokal.status === Status.Active) return 'Active';
    else if (lokal.status === Status.Pending) return 'Pending';
    else if (lokal.status === Status.Declined) return 'Declined';
    else return 'Inactive';
  }

  public getUserStatusText(user: User): string {
    if (user.status === Status.Active) return 'Active';
    else if (user.status === Status.Pending) return 'Pending';
    else if (user.status === Status.Declined) return 'Declined';
    else return 'Inactive';
  }
  // endregion

  // region search
  public handleUsersSearch(value: string): void {
    this.usersSearchKey = value;
    if (this.usersSearchKey.length > 2) {
      this.filteredUsers = this.users.filter(
        (user: User) =>
          user.firstName
            .toLowerCase()
            .startsWith(this.usersSearchKey.toLowerCase()) ||
          user.lastName
            .toLowerCase()
            .startsWith(this.usersSearchKey.toLowerCase()),
      );
    } else {
      this.filteredUsers = this.users;
    }
  }

  public handleLokalsSearch(value: string): void {
    this.lokalsSearchKey = value;
    if (this.lokalsSearchKey.length > 2) {
      this.filteredLokals = this.lokals.filter((lokal: Lokal) =>
        lokal.name.toLowerCase().startsWith(this.lokalsSearchKey.toLowerCase()),
      );
    } else {
      this.filteredLokals = this.lokals;
    }
  }
  // endregion

  // region lokal handlers
  public handleLokalDelete(lokal: Lokal): void {
    if (this.isButtonSpinnerOn) return;

    this.isButtonSpinnerOn = true;

    this.adminService.deleteLokal(lokal).subscribe({
      next: (): void => {
        const lokalIndexInFiltered = this.filteredLokals.indexOf(lokal);
        if (lokalIndexInFiltered > -1)
          this.filteredLokals.splice(lokalIndexInFiltered, 1);

        const lokalIndexInUsers = this.lokals.indexOf(lokal);
        if (lokalIndexInUsers > -1) this.lokals.splice(lokalIndexInUsers, 1);

        this.isButtonSpinnerOn = false;
        this.getAllUsersAndLokals();
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isButtonSpinnerOn = false;
      },
    });
  }

  public handleLokalApprove(lokal: Lokal): void {
    if (this.isButtonSpinnerOn) return;

    this.isButtonSpinnerOn = true;

    this.adminService.updateStatus(lokal.id, Status.Active).subscribe({
      next: (): void => {
        lokal.status = Status.Active;
        this.isButtonSpinnerOn = false;
        this.getAllUsersAndLokals();
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isButtonSpinnerOn = false;
      },
    });
  }

  public handleLokalDecline(lokal: Lokal): void {
    if (this.isButtonSpinnerOn) return;

    this.isButtonSpinnerOn = true;

    this.adminService.updateStatus(lokal.id, Status.Declined).subscribe({
      next: (): void => {
        lokal.status = Status.Declined;
        this.isButtonSpinnerOn = false;
        this.getAllUsersAndLokals();
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isButtonSpinnerOn = false;
      },
    });
  }

  public handleStopLokalSubscription(lokal: Lokal): void {
    if (this.isButtonSpinnerOn) return;

    this.isButtonSpinnerOn = true;

    this.adminService.updateSubscription(lokal.id, false).subscribe({
      next: (): void => {
        lokal.hasActiveSubscription = false;
        this.isButtonSpinnerOn = false;
        this.getAllUsersAndLokals();
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isButtonSpinnerOn = false;
      },
    });
  }

  public handleStartLokalSubscription(lokal: Lokal): void {
    if (this.isButtonSpinnerOn) return;

    this.isButtonSpinnerOn = true;

    this.adminService.updateSubscription(lokal.id, true).subscribe({
      next: (): void => {
        lokal.hasActiveSubscription = true;
        this.isButtonSpinnerOn = false;
        this.getAllUsersAndLokals();
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isButtonSpinnerOn = false;
      },
    });
  }

  public async handleEditLokal(lokal: Lokal): Promise<void> {
    await this.router.navigate(['admin-edit-lokal', lokal.id]);
  }

  public async handlePopularActionClick(lokal: Lokal): Promise<void> {
    if (this.isButtonSpinnerOn) return;

    this.isButtonSpinnerOn = true;

    this.adminService.editLokalIsPopular(lokal.id, !lokal.isPopular).subscribe({
      next: (): void => {
        lokal.isPopular = !lokal.isPopular;
        this.isButtonSpinnerOn = false;
        this.getAllUsersAndLokals();
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isButtonSpinnerOn = false;
      },
    });
  }

  public async handleRecommendedActionClick(lokal: Lokal): Promise<void> {
    if (this.isButtonSpinnerOn) return;

    this.isButtonSpinnerOn = true;

    this.adminService
      .editLokalIsRecommended(lokal.id, !lokal.isRecommended)
      .subscribe({
        next: (): void => {
          lokal.isRecommended = !lokal.isRecommended;
          this.isButtonSpinnerOn = false;
          this.getAllUsersAndLokals();
        },
        error: (httpErrorResponse: HttpErrorResponse): void => {
          this.toastService.error(httpErrorResponse.error);
          this.isButtonSpinnerOn = false;
        },
      });
  }
  // endregion

  // region user handlers
  public async handleEditUser(user: User): Promise<void> {
    await this.router.navigate(['admin-edit-user', user.id]);
  }

  public handleUserDelete(user: User): void {
    if (this.isButtonSpinnerOn) return;

    this.isButtonSpinnerOn = true;

    this.adminService.deleteUser(user).subscribe({
      next: (): void => {
        const userIndexInFiltered = this.filteredUsers.indexOf(user);
        if (userIndexInFiltered > -1)
          this.filteredUsers.splice(userIndexInFiltered, 1);

        const userIndexInUsers = this.users.indexOf(user);
        if (userIndexInUsers > -1) this.users.splice(userIndexInUsers, 1);

        this.isButtonSpinnerOn = false;
        this.getAllUsersAndLokals();
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isButtonSpinnerOn = false;
      },
    });
  }

  public handleUserApprove(user: User): void {
    if (this.isButtonSpinnerOn) return;

    this.isButtonSpinnerOn = true;

    this.adminService.updateStatus(user.id, Status.Active).subscribe({
      next: (): void => {
        user.status = Status.Active;
        this.isButtonSpinnerOn = false;
        this.getAllUsersAndLokals();
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isButtonSpinnerOn = false;
      },
    });
  }

  public handleUserDecline(user: User): void {
    if (this.isButtonSpinnerOn) return;

    this.isButtonSpinnerOn = true;

    this.adminService.updateStatus(user.id, Status.Declined).subscribe({
      next: (): void => {
        user.status = Status.Declined;
        this.isButtonSpinnerOn = false;
        this.getAllUsersAndLokals();
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isButtonSpinnerOn = false;
      },
    });
  }
  // endregion

  protected readonly LokalStatus = Status;
}
