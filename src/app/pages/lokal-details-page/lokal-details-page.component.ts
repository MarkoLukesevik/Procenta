import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import { LokalsService } from '../../services/lokals.service';
import { LanguageService } from '../../services/language.service';

import { Lokal } from '../../models/lokal';

@Component({
  selector: 'app-lokal-details-page',
  imports: [CommonModule],
  templateUrl: './lokal-details-page.component.html',
  styleUrl: './lokal-details-page.component.scss',
})
export class LokalDetailsPageComponent implements OnInit {
  private lokalsService: LokalsService = inject(LokalsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private toastService: ToastrService = inject(ToastrService);
  private languageService: LanguageService = inject(LanguageService);

  public lokal: Lokal | undefined = undefined;
  public isPageLoading: boolean = false;

  ngOnInit(): void {
    const lokalId: string | null = this.route.snapshot.paramMap.get('id');
    this.isPageLoading = true;
    if (lokalId) {
      this.lokalsService.getLokal(lokalId).subscribe({
        next: (lokal: Lokal): void => {
          this.lokal = lokal;
          this.isPageLoading = false;
        },
        error: (httpErrorResponse: HttpErrorResponse): void => {
          this.toastService.error(httpErrorResponse.error);
          this.isPageLoading = false;
        },
      });
    }
  }

  public t(key: string): string {
    return this.languageService.translate(key);
  }

  protected readonly encodeURIComponent = encodeURIComponent;
}
