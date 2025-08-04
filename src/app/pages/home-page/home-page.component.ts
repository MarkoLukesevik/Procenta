import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { LokalsService } from '../../services/lokals.service';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../services/language.service';

import { LokalCardComponent } from './components/lokal-card/lokal-card.component';
import { LokalsSliderComponent } from './components/lokals-slider/lokals-slider.component';

import { Lokal, LokalType } from '../../models/lokal';
import { Status } from '../../models/enums/status';

@Component({
  selector: 'app-home-page',
  imports: [
    CommonModule,
    FormsModule,
    LokalsSliderComponent,
    LokalCardComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private lokalsService: LokalsService = inject(LokalsService);
  private toastService: ToastrService = inject(ToastrService);
  private languageService: LanguageService = inject(LanguageService);

  public searchValue: string = '';

  public isPageLoading: boolean = false;

  public lokals: Lokal[] = [];
  public filteredLokals: Lokal[] = [];

  public popularLokals: Lokal[] = [];
  public recommendedLokals: Lokal[] = [];
  public coffeeShops: Lokal[] = [];
  public bars: Lokal[] = [];
  public restaurants: Lokal[] = [];

  ngOnInit(): void {
    this.getLokals();
  }

  public t(key: string): string {
    return this.languageService.translate(key);
  }

  private getLokals(): void {
    this.isPageLoading = true;

    this.lokalsService.getLokals().subscribe({
      next: (lokals: Lokal[]) => {
        this.lokals = lokals;
        this.lokals = this.lokals.filter(
          (lokal: Lokal) => lokal.status === Status.Active,
        );
        this.popularLokals = this.lokals.filter(
          (lokal: Lokal) => lokal.isPopular,
        );
        this.recommendedLokals = this.lokals.filter(
          (lokal: Lokal) => lokal.isRecommended,
        );
        this.coffeeShops = this.lokals.filter(
          (lokal: Lokal) => lokal.lokalType === LokalType.CoffeeShop,
        );
        this.bars = this.lokals.filter(
          (lokal: Lokal) => lokal.lokalType === LokalType.Bar,
        );
        this.restaurants = this.lokals.filter(
          (lokal: Lokal) => lokal.lokalType === LokalType.Restaurant,
        );
        this.lokalsService.setLokals(lokals);
        this.isPageLoading = false;
      },
      error: (httpErrorResponse: HttpErrorResponse): void => {
        this.toastService.error(httpErrorResponse.error);
        this.isPageLoading = false;
      },
    });
  }

  public handleSearch(): void {
    if (this.searchValue.trim()) {
      this.filteredLokals = this.lokals.filter((lokal: Lokal): boolean =>
        lokal.name.toLowerCase().startsWith(this.searchValue.toLowerCase()),
      );
    }
  }
}
