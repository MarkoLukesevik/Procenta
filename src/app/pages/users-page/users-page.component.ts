import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

import { User } from '../../models/user';

@Component({
  selector: 'app-users-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent implements OnInit {
  private userService: UserService = inject(UserService);
  private toastService: ToastrService = inject(ToastrService);
  private router: Router = inject(Router);

  public users: User[] = [];
  public filteredUsers: User[] = [];

  private pageSize: number = 10;
  private currentPage: number = 1;
  public isLoadMoreButtonSpinnerOn: boolean = false;
  public isPageLoading: boolean = false;

  public searchValue: string = '';

  ngOnInit(): void {
    this.getUsers();
  }

  public async handleLokalClick(id: string | undefined): Promise<void> {
    if (!id) return;
    await this.router.navigate(['lokal', id]);
  }

  public handleSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  public handleLoadMoreClick(): void {
    this.isLoadMoreButtonSpinnerOn = true;

    setTimeout((): void => {
      this.currentPage++;
      this.applyFilters();
      this.isLoadMoreButtonSpinnerOn = false;
    }, 200);
  }

  private applyFilters(): void {
    let result: User[] = [...this.users];

    if (this.searchValue.trim()) {
      result = result.filter((user: User): boolean => {
        if (user.lokalName) {
          return (
            user.firstName
              .toLowerCase()
              .includes(this.searchValue.toLowerCase()) ||
            user.lastName
              .toLowerCase()
              .includes(this.searchValue.toLowerCase()) ||
            user.lokalName
              .toLowerCase()
              .includes(this.searchValue.toLowerCase())
          );
        }
        return (
          user.firstName
            .toLowerCase()
            .includes(this.searchValue.toLowerCase()) ||
          user.lastName.toLowerCase().includes(this.searchValue.toLowerCase())
        );
      });
    }

    this.filteredUsers = result.slice(0, this.pageSize * this.currentPage);
  }

  private getUsers(): void {
    this.isLoadMoreButtonSpinnerOn = true;
    this.isPageLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]): void => {
        this.users = users;
        this.applyFilters();
        this.isLoadMoreButtonSpinnerOn = false;
        this.isPageLoading = false;
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isLoadMoreButtonSpinnerOn = false;
        this.isPageLoading = false;
      },
    });
  }
}
