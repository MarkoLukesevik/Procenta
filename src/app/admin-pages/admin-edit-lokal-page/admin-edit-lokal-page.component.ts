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
import { BaseTextareaComponent } from '../../base-components/base-textarea/base-textarea.component';

import { UserService } from '../../services/user.service';
import { LokalsService } from '../../services/lokals.service';
import { ToastrService } from 'ngx-toastr';

import { Lokal, LokalType } from '../../models/lokal';
import { User } from '../../models/user';
import { PhotoRequest } from '../../requests/user-requests/edit-user-request';

@Component({
  selector: 'app-admin-edit-lokal-page',
  imports: [
    CommonModule,
    BaseInputComponent,
    BaseNumberInputComponent,
    BaseSelectComponent,
    BaseTextareaComponent,
  ],
  templateUrl: './admin-edit-lokal-page.component.html',
  styleUrl: './admin-edit-lokal-page.component.scss',
})
export class AdminEditLokalPageComponent implements OnInit {
  private userService: UserService = inject(UserService);
  private lokalService: LokalsService = inject(LokalsService);
  private toastService: ToastrService = inject(ToastrService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  public lokalTypeOptions: BaseSelectOption[] = [
    { text: 'Restaurant', value: LokalType.Restaurant },
    { text: 'Bar', value: LokalType.Bar },
    { text: 'CoffeeShop', value: LokalType.CoffeeShop },
  ];
  public lokalType!: BaseSelectOption;

  public emailError: string = '';

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

  private loggedInUser: User | null = null;
  public lokal!: Lokal;

  public isSaveButtonSpinnerOn: boolean = false;
  public isPageLoading: boolean = false;

  private users: User[] = [];
  public filteredUsers: User[] = [];
  public matchingUsers: User[] = [];
  public searchUserKey: string = '';
  public lokalEmployees: User[] = [];

  async ngOnInit(): Promise<void> {
    this.isPageLoading = true;
    this.loggedInUser = this.userService.getLoggedInUser()();

    if (!this.loggedInUser?.isAdmin) {
      await this.router.navigate(['home']);
    }

    const lokalId: string | null = this.route.snapshot.paramMap.get('id');
    if (lokalId) {
      this.lokalService.getLokal(lokalId).subscribe({
        next: (lokal: Lokal) => {
          this.lokal = lokal;
          if (this.lokal.image) this.lokalPicture.imageUrl = this.lokal.image;

          if (
            this.lokal.additionalImages &&
            this.lokal.additionalImages.length > 0
          ) {
            this.additionalLocalPictures[0].imageUrl = this.lokal
              .additionalImages[0]
              ? this.lokal.additionalImages[0]
              : null;
            this.additionalLocalPictures[1].imageUrl = this.lokal
              .additionalImages[1]
              ? this.lokal.additionalImages[1]
              : null;
            this.additionalLocalPictures[2].imageUrl = this.lokal
              .additionalImages[2]
              ? this.lokal.additionalImages[2]
              : null;
            this.additionalLocalPictures[3].imageUrl = this.lokal
              .additionalImages[3]
              ? this.lokal.additionalImages[3]
              : null;
          }

          const foundLokalType: BaseSelectOption | undefined =
            this.lokalTypeOptions.find(
              (item: BaseSelectOption) => item.value === this.lokal.lokalType,
            );
          if (foundLokalType) this.lokalType = foundLokalType;

          if (this.lokal.employees.length > 0) {
            this.lokalEmployees = this.lokal.employees;
          }

          this.userService.getAllUsers().subscribe({
            next: (users: User[]) => {
              this.users = users;
              this.filteredUsers = this.users.filter(
                (user: User) => !user.lokalId,
              );
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
  public handleLokalTypeChange(event: BaseSelectOption): void {
    this.lokalType = event;
    if (event.value === 'Restaurant')
      this.lokal.lokalType = LokalType.Restaurant;
    else if (event.value === 'Bar') this.lokal.lokalType = LokalType.Bar;
    else if (event.value === 'Coffee_Shop')
      this.lokal.lokalType = LokalType.CoffeeShop;
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

  // region remove employee
  public handleRemoveEmployee(employee: User): void {
    const employeeIndex: number = this.lokalEmployees.indexOf(employee);
    if (employeeIndex > -1) this.lokalEmployees.splice(employeeIndex, 1);

    this.filteredUsers = this.users.filter((user: User) => !user.lokalId);
  }
  // endregion

  // region picture handlers
  public handleLokalPictureChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.lokalPicture.name = input.files[0].name;

      const reader = new FileReader();
      reader.onload = () => {
        this.lokalPicture.imageUrl = reader.result as string;

        this.lokalPicture.payload = this.lokalPicture.imageUrl.replace(
          /^.*?,/,
          '',
        );
      };
      reader.readAsDataURL(input.files[0]);
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

  public handleAdditionalLokalPictureChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.additionalLocalPictures[index].name = input.files[0].name;

      const reader = new FileReader();
      reader.onload = () => {
        this.additionalLocalPictures[index].imageUrl = reader.result as string;
        this.additionalLocalPictures[index].payload =
          this.additionalLocalPictures[index].imageUrl.replace(/^.*?,/, '');
      };
      reader.readAsDataURL(input.files[0]);
    }

    input.value = '';
  }
  // endregion

  // region save lokal
  public isSaveLokalButtonDisabled(): boolean {
    return !this.lokal.name || !this.lokal.email || this.isSaveButtonSpinnerOn;
  }

  public handleSaveLokal(): void {
    this.validateLokalEmail();
    if (this.emailError) return;

    this.isSaveButtonSpinnerOn = true;

    const lokal = {
      ...this.lokal,
      image: this.lokalPicture,
      additionalImages: this.additionalLocalPictures,
      employees: this.lokalEmployees.map((user: User): string => user.id),
    };

    this.lokalService.editLokal(lokal).subscribe({
      next: async (lokal: Lokal) => {
        this.lokal = lokal;
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
  private validateLokalEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.lokal.email)) {
      this.emailError = 'Invalid email format.';
      return false;
    }

    this.emailError = '';
    return true;
  }
  // endregion
}
