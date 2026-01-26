import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs/operators';
import imageCompression from 'browser-image-compression';
import { Router } from '@angular/router';

import { BaseInputComponent } from '../../base-components/base-input/base-input.component';
import {
  BaseSelectComponent,
  BaseSelectOption,
} from '../../base-components/base-select/base-select.component';
import { BaseNumberInputComponent } from '../../base-components/base-number-input/base-number-input.component';
import { BaseTextareaComponent } from '../../base-components/base-textarea/base-textarea.component';

import { AreYouSureModalComponent } from '../../modals/are-you-sure-modal/are-you-sure-modal.component';

import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { LokalsService } from '../../services/lokals.service';
import { LanguageService } from '../../services/language.service';
import { ModalService } from '../../services/modal.service';

import { User, UserGender } from '../../models/user';
import { Lokal, LokalType } from '../../models/lokal';
import { AuthService } from '../../services/auth-service';
import { Status } from '../../models/enums/status';

import { PhotoRequest } from '../../requests/user-requests/edit-user-request';

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    BaseInputComponent,
    BaseSelectComponent,
    BaseNumberInputComponent,
    BaseTextareaComponent,
    FormsModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private userService: UserService = inject(UserService);
  private lokalService: LokalsService = inject(LokalsService);
  private toastService: ToastrService = inject(ToastrService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private languageService: LanguageService = inject(LanguageService);
  private modalService: ModalService = inject(ModalService);

  public genderOptions: BaseSelectOption[] = [
    { text: 'Male', value: 'male' },
    { text: 'Female', value: 'female' },
  ];

  public lokalTypeOptions: BaseSelectOption[] = [
    { text: 'Restaurant', value: LokalType.Restaurant },
    { text: 'Bar', value: LokalType.Bar },
    { text: 'CoffeeShop', value: LokalType.CoffeeShop },
  ];

  public lokalType!: BaseSelectOption;

  public gender: BaseSelectOption = this.genderOptions[0];

  public emailError: string = '';

  public profilePicture: PhotoRequest = {
    name: null,
    payload: null,
    imageUrl: null,
  };
  public lokalPicture: PhotoRequest = {
    name: null,
    payload: null,
    imageUrl: null,
  };
  public additionalLocalPictures: PhotoRequest[] = [
    {
      name: null,
      payload: null,
      imageUrl: null,
    },
    {
      name: null,
      payload: null,
      imageUrl: null,
    },
    {
      name: null,
      payload: null,
      imageUrl: null,
    },
    {
      name: null,
      payload: null,
      imageUrl: null,
    },
  ];

  public user!: User;
  public lokal!: Lokal;

  public isSaveButtonSpinnerOn: boolean = false;
  public isDeleteButtonSpinnerOn: boolean = false;
  public isVerifyButtonSpinnerOn: boolean = false;

  public lokals: Lokal[] = [];
  public matchingLokals: Lokal[] = [];
  public searchLokalKey: string = '';
  public userWorkplace?: Lokal;

  private users: User[] = [];
  public filteredUsers: User[] = [];
  public matchingUsers: User[] = [];
  public searchUserKey: string = '';
  public lokalEmployees: User[] = [];

  public isLangMk: boolean;

  constructor() {
    this.isLangMk = this.languageService.getCurrentLang() === 'mk';
  }

  ngOnInit(): void {
    const user: User | null = this.userService.getLoggedInUser()();
    const lokal: Lokal | null = this.lokalService.getLoggedInLokal()();
    if (user) {
      this.handleUserInit(user);
    } else if (lokal) {
      this.handleLokalInit(lokal);
    }
  }

  public t(key: string): string {
    return this.languageService.translate(key);
  }

  public async switchLanguage(): Promise<void> {
    await this.languageService.setLang(this.isLangMk ? 'mk' : 'en');
  }

  // region ui formatters
  public getLokalStatusText(): string {
    if (this.lokal.status === Status.Active) return this.t('active');
    else if (this.lokal.status === Status.Pending) return this.t('pending');
    else if (this.lokal.status === Status.Declined) return this.t('declined');
    else return this.t('inactive');
  }

  public getUserStatusText(): string {
    if (this.user.status === Status.Active) return this.t('active');
    else if (this.user.status === Status.Pending) return this.t('pending');
    else if (this.user.status === Status.Declined) return this.t('declined');
    else return this.t('inactive');
  }
  // endregion

  // region init handlers
  private handleUserInit(user: User): void {
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
      },
      error: (httpErrorResponse: HttpErrorResponse) => {
        this.toastService.error(httpErrorResponse.error);
      },
    });
  }

  private handleLokalInit(lokal: Lokal): void {
    this.lokal = lokal;
    if (this.lokal.image) this.lokalPicture.imageUrl = this.lokal.image;

    if (this.lokal.additionalImages && this.lokal.additionalImages.length > 0) {
      this.additionalLocalPictures[0].imageUrl = this.lokal.additionalImages[0]
        ? this.lokal.additionalImages[0]
        : null;
      this.additionalLocalPictures[1].imageUrl = this.lokal.additionalImages[1]
        ? this.lokal.additionalImages[1]
        : null;
      this.additionalLocalPictures[2].imageUrl = this.lokal.additionalImages[2]
        ? this.lokal.additionalImages[2]
        : null;
      this.additionalLocalPictures[3].imageUrl = this.lokal.additionalImages[3]
        ? this.lokal.additionalImages[3]
        : null;
    }

    if (this.lokal.employees.length > 0) {
      this.lokalEmployees = this.lokal.employees;
    }

    const foundLokalType: BaseSelectOption | undefined =
      this.lokalTypeOptions.find(
        (item: BaseSelectOption) => item.value === this.lokal.lokalType,
      );
    if (foundLokalType) this.lokalType = foundLokalType;

    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.filteredUsers = this.users.filter((user: User) => !user.lokalId);
      },
      error: (httpErrorResponse: HttpErrorResponse) => {
        this.toastService.error(httpErrorResponse.error);
      },
    });
  }
  // endregion

  // region select handlers
  public handleGenderChange(event: BaseSelectOption): void {
    this.gender = event;
    if (event.value === 'male') this.user.gender = UserGender.Male;
    else if (event.value === 'female') this.user.gender = UserGender.Female;
  }

  public handleLokalTypeChange(event: BaseSelectOption): void {
    this.lokalType = event;
    if (event.value === 'Restaurant')
      this.lokal.lokalType = LokalType.Restaurant;
    else if (event.value === 'Bar') this.lokal.lokalType = LokalType.Bar;
    else if (event.value === 'Coffee_Shop')
      this.lokal.lokalType = LokalType.CoffeeShop;
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

  // region search user
  public handleUsersSearch(value: string): void {
    this.searchUserKey = value;
    if (this.searchUserKey.length > 2) {
      this.matchingUsers = this.filteredUsers.filter(
        (user: User) =>
          user.firstName
            .toLowerCase()
            .startsWith(this.searchUserKey.toLowerCase()) ||
          user.lastName
            .toLowerCase()
            .startsWith(this.searchUserKey.toLowerCase()),
      );
    } else {
      this.matchingUsers = [];
    }
  }

  public handleMatchingUserClick(user: User): void {
    this.lokalEmployees.push(user);
    this.searchUserKey = '';
  }
  // endregion

  // region remove user workplace
  public handleRemoveUserLokal(): void {
    if (this.user.lokalId) {
      this.modalService
        .open(AreYouSureModalComponent, {
          title: this.t('are_you_sure_you_want_to_delete_your_workplace'),
          description: this.t('if_you_delete_your_workplace'),
        })
        .pipe(take(1))
        .subscribe((res: boolean): void => {
          if (res) {
            this.userWorkplace = undefined;
          }
        });
    } else this.userWorkplace = undefined;
  }
  // endregion

  // region remove employee
  public handleRemoveEmployee(employee: User): void {
    const employeeIndex: number = this.lokalEmployees.indexOf(employee);
    if (employeeIndex > -1) this.lokalEmployees.splice(employeeIndex, 1);

    this.filteredUsers = this.users.filter((user: User) => !user.lokalId);
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
      next: (user: User) => {
        this.userService.setLoggedInUser(user);
        this.user = user;
        this.isSaveButtonSpinnerOn = false;
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isSaveButtonSpinnerOn = false;
      },
    });
  }
  // endregion

  // region save lokal
  public isSaveLokalButtonDisabled(): boolean {
    return !this.lokal.name || !this.lokal.email || this.isSaveButtonSpinnerOn;
  }

  public handleSaveLokal(): void {
    this.validateLokalEmail();
    if (this.emailError) return;

    if (this.isEmployeesListModified()) {
      this.modalService
        .open(AreYouSureModalComponent, {
          title: this.t('are_you_sure_you_want_to_proceed'),
          description: this.t('since_you_changed_the_employee_list'),
        })
        .pipe(take(1))
        .subscribe((res: boolean): void => {
          if (res) {
            this.proceedLokalSave();
          }
        });
    } else this.proceedLokalSave();
  }

  private proceedLokalSave(): void {
    this.isSaveButtonSpinnerOn = true;

    const lokal = {
      ...this.lokal,
      image: this.lokalPicture,
      additionalImages: this.additionalLocalPictures,
      employees: this.lokalEmployees.map((user: User): string => user.id),
    };
    this.lokalService.editLokal(lokal).subscribe({
      next: (lokal: Lokal) => {
        this.lokalService.setLoggedInLokal(lokal);
        this.lokal = lokal;
        this.isSaveButtonSpinnerOn = false;
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isSaveButtonSpinnerOn = false;
      },
    });
  }

  private isEmployeesListModified(): boolean {
    if (this.lokal.employees.length !== this.lokalEmployees.length) return true;
    else if (this.lokal.employees.length === this.lokalEmployees.length)
      return false;

    return this.lokal.employees.every(
      (item: User, index: number) => item.id !== this.lokalEmployees[index]?.id,
    );
  }
  // endregion

  public async handleLogoutClick(): Promise<void> {
    this.userService.removeLoggedInUser();
    this.lokalService.removeLoggedInLokal();
    this.authService.removeAccountInfo();
    await this.router.navigateByUrl('home');
  }

  // region account delete
  public async handleDeleteAccountClick(): Promise<void> {
    if (this.isDeleteButtonSpinnerOn) return;

    this.modalService
      .open(AreYouSureModalComponent, {
        title: this.t('are_you_sure_you_want_to_delete_your_account'),
        description: this.t('this_action_is_permanent_and_cannot_be_undone'),
      })
      .pipe(take(1))
      .subscribe((res: boolean): void => {
        if (res) {
          this.isDeleteButtonSpinnerOn = true;

          if (this.user) {
            this.handleUserAccountDelete();
          } else if (this.lokal) {
            this.handleLokalAccountDelete();
          }
        }
      });
  }

  private handleUserAccountDelete(): void {
    this.userService.deleteUser(this.user).subscribe({
      next: async () => {
        this.isDeleteButtonSpinnerOn = false;
        await this.handleLogoutClick();
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isDeleteButtonSpinnerOn = false;
      },
    });
  }

  private handleLokalAccountDelete(): void {
    this.lokalService.deleteLokal(this.lokal).subscribe({
      next: async () => {
        this.isDeleteButtonSpinnerOn = false;
        await this.handleLogoutClick();
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isDeleteButtonSpinnerOn = false;
      },
    });
  }
  // endregion

  // region picture handlers
  public async handleProfilePictureChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      this.profilePicture.name = compressedFile.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture.imageUrl = reader.result as string;

        this.profilePicture.payload = this.profilePicture.imageUrl.replace(
          /^.*?,/,
          '',
        );
      };
      reader.readAsDataURL(compressedFile);
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

  public async handleLokalPictureChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      this.lokalPicture.name = compressedFile.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.lokalPicture.imageUrl = reader.result as string;

        this.lokalPicture.payload = this.lokalPicture.imageUrl.replace(
          /^.*?,/,
          '',
        );
      };
      reader.readAsDataURL(compressedFile);
    }

    input.value = '';
  }

  public handleDeleteLocalPicture(event: Event): void {
    event.stopPropagation();
    this.lokalPicture = {
      name: null,
      payload: null,
      imageUrl: null,
    };
  }

  public handleDeleteAdditionalLocalPicture(event: Event, index: number): void {
    event.stopPropagation();
    this.additionalLocalPictures[index] = {
      name: null,
      payload: null,
      imageUrl: null,
    };
  }

  public triggerAdditionalLocalPictureFileInput(index: number): void {
    const fileInput = document.getElementById(
      `additionalLokalPictureUploadInput-${index}`,
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  public async handleAdditionalLokalPictureChange(
    event: Event,
    index: number,
  ): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      this.additionalLocalPictures[index].name = compressedFile.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.additionalLocalPictures[index].imageUrl = reader.result as string;
        this.additionalLocalPictures[index].payload =
          this.additionalLocalPictures[index].imageUrl.replace(/^.*?,/, '');
      };
      reader.readAsDataURL(compressedFile);
    }

    input.value = '';
  }
  // endregion

  // region account verification
  public handleAccountVerificationClick(id: string) {
    this.isVerifyButtonSpinnerOn = true;
    this.authService.verifyAccount(id).subscribe({
      next: async () => {
        this.toastService.success(this.t('verification_mail'));
        this.isVerifyButtonSpinnerOn = false;
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isVerifyButtonSpinnerOn = false;
      },
    });
  }
  // endregion

  // region validation
  private validateUserEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.user.email)) {
      this.emailError = this.t('invalid_email_format');
      return false;
    }

    this.emailError = '';
    return true;
  }

  private validateLokalEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.lokal.email)) {
      this.emailError = this.t('invalid_email_format');
      return false;
    }

    this.emailError = '';
    return true;
  }
  // endregion
  protected readonly Status = Status;
}
