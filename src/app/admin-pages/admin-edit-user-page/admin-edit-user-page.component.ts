import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { BaseInputComponent } from '../../base-components/base-input/base-input.component';
import { BaseNumberInputComponent } from '../../base-components/base-number-input/base-number-input.component';
import {
  BaseSelectComponent,
  BaseSelectOption,
} from '../../base-components/base-select/base-select.component';

import { UserService } from '../../services/user.service';
import { LokalsService } from '../../services/lokals.service';
import { ToastrService } from 'ngx-toastr';

import { User, UserGender } from '../../models/user';
import { Lokal } from '../../models/lokal';

import { PhotoRequest } from '../../requests/user-requests/edit-user-request';

@Component({
  selector: 'app-admin-edit-user-page',
  imports: [
    BaseInputComponent,
    BaseNumberInputComponent,
    BaseSelectComponent,
    CommonModule,
  ],
  templateUrl: './admin-edit-user-page.component.html',
  styleUrl: './admin-edit-user-page.component.scss',
})
export class AdminEditUserPageComponent implements OnInit {
  private userService: UserService = inject(UserService);
  private lokalService: LokalsService = inject(LokalsService);
  private toastService: ToastrService = inject(ToastrService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  public genderOptions: BaseSelectOption[] = [
    { text: 'Male', value: 'male' },
    { text: 'Female', value: 'female' },
  ];

  public gender: BaseSelectOption = this.genderOptions[0];

  public emailError: string = '';

  public profilePicture: PhotoRequest = {
    name: null,
    payload: null,
    imageUrl: null,
  };

  private loggedInUser: User | null = null;
  public user!: User;

  public isSaveButtonSpinnerOn: boolean = false;
  public isPageLoading: boolean = false;

  public lokals: Lokal[] = [];
  public matchingLokals: Lokal[] = [];
  public searchLokalKey: string = '';
  public userWorkplace?: Lokal;

  async ngOnInit(): Promise<void> {
    this.isPageLoading = true;
    this.loggedInUser = this.userService.getLoggedInUser()();

    if (!this.loggedInUser?.isAdmin) {
      await this.router.navigate(['home']);
    }

    const userId: string | null = this.route.snapshot.paramMap.get('id');

    if (userId) {
      this.userService.getUser(userId).subscribe({
        next: (user: User) => {
          this.user = user;
          if (this.user.profilePhoto)
            this.profilePicture.imageUrl = this.user.profilePhoto;

          this.lokalService.getLokals().subscribe({
            next: (lokals: Lokal[]) => {
              this.lokals = lokals;

              if (this.user.lokalId) {
                this.userWorkplace = lokals.find(
                  (l: Lokal) => l.id === this.user.lokalId,
                );
              }
              this.isPageLoading = false;
            },
            error: (httpErrorResponse: HttpErrorResponse) => {
              this.toastService.error(httpErrorResponse.error);
            },
          });
          this.isPageLoading = false;
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          this.toastService.error(httpErrorResponse.error);
        },
      });
    }
  }

  // region select handlers
  public handleGenderChange(event: BaseSelectOption): void {
    this.gender = event;
    if (event.value === 'male') this.user.gender = UserGender.Male;
    else if (event.value === 'female') this.user.gender = UserGender.Female;
  }
  // endregion

  // region search lokal
  public handleLokalsSearch(value: string): void {
    this.searchLokalKey = value;
    if (this.searchLokalKey.length > 2) {
      this.matchingLokals = this.lokals.filter((l: Lokal) =>
        l.name.toLowerCase().startsWith(this.searchLokalKey.toLowerCase()),
      );
    } else {
      this.matchingLokals = [];
    }
  }

  public handleMatchingLokalClick(lokal: Lokal): void {
    this.userWorkplace = lokal;
    this.searchLokalKey = '';
  }
  // endregion

  // region remove user workplace
  public handleRemoveUserLokal(): void {
    this.userWorkplace = undefined;
  }
  // endregion

  // region picture handlers
  public handleProfilePictureChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.profilePicture.name = input.files[0].name;

      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture.imageUrl = reader.result as string;

        this.profilePicture.payload = this.profilePicture.imageUrl.replace(
          /^.*?,/,
          '',
        );
      };
      reader.readAsDataURL(input.files[0]);
    }

    input.value = '';
  }

  public handleDeletePreviewProfilePicture(event: Event): void {
    event.stopPropagation();
    this.profilePicture = {
      name: null,
      payload: null,
      imageUrl: null,
    };
  }
  // endregion

  // region save user
  public isSaveUserButtonDisabled(): boolean {
    return (
      !this.user.firstName ||
      !this.user.lastName ||
      !this.user.email ||
      this.isSaveButtonSpinnerOn
    );
  }

  public handleSaveUser(): void {
    this.validateUserEmail();
    if (this.emailError) return;

    this.isSaveButtonSpinnerOn = true;

    const user = {
      ...this.user,
      profilePhoto: this.profilePicture,
    };
    if (this.userWorkplace) {
      user.lokalId = this.userWorkplace.id;
      user.lokalName = this.userWorkplace.name;
    } else {
      user.lokalId = undefined;
      user.lokalName = undefined;
    }
    this.userService.editUser(user).subscribe({
      next: async (user: User) => {
        this.user = user;
        this.isSaveButtonSpinnerOn = false;
        await this.router.navigate(['admin']);
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isSaveButtonSpinnerOn = false;
      },
    });
  }
  // endregion

  // region validation
  private validateUserEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.user.email)) {
      this.emailError = 'Invalid email format.';
      return false;
    }

    this.emailError = '';
    return true;
  }
  // endregion
}
