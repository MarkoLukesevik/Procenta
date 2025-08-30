import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../services/language.service';
import { LokalsService } from '../../services/lokals.service';
import { Lokal } from '../../models/lokal';
import { Router } from '@angular/router';
import StatisticsResponse from '../../responses/statistics';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-statistics-page',
  imports: [],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss',
})
export class StatisticsPageComponent implements OnInit {
  private toastService: ToastrService = inject(ToastrService);
  private languageService: LanguageService = inject(LanguageService);
  private lokalsService: LokalsService = inject(LokalsService);
  private router: Router = inject(Router);

  private loggedInLokal: Lokal | null = null;
  public statistics!: StatisticsResponse;
  public isPageSpinnerOn: boolean = false;

  async ngOnInit(): Promise<void> {
    this.isPageSpinnerOn = true;
    this.loggedInLokal = this.lokalsService.getLoggedInLokal()();

    if (this.loggedInLokal?.id)
      this.lokalsService.getStatistics(this.loggedInLokal?.id).subscribe({
        next: (res: StatisticsResponse): void => {
          this.statistics = res;
          this.isPageSpinnerOn = false;
        },
        error: (error: HttpErrorResponse): void => {
          this.toastService.error(error.message);
          this.isPageSpinnerOn = false;
        },
      });
    else await this.router.navigateByUrl('home');
  }

  public t(key: string): string {
    return this.languageService.translate(key);
  }
}
