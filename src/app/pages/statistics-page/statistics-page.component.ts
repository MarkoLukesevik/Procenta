import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../services/language.service';
import { LokalsService } from '../../services/lokals.service';

import { Lokal } from '../../models/lokal';
import StatisticsResponse, {
  StatisticsPerDay,
} from '../../responses/statistics';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics-page',
  imports: [BaseChartDirective],
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

  chartData!: ChartData<'bar', number[], string>;
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: this.t('qr_scans_per_day') },
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  async ngOnInit(): Promise<void> {
    this.isPageSpinnerOn = true;
    this.loggedInLokal = this.lokalsService.getLoggedInLokal()();

    if (this.loggedInLokal?.id)
      this.lokalsService.getStatistics(this.loggedInLokal?.id).subscribe({
        next: (res: StatisticsResponse): void => {
          this.statistics = res;
          this.isPageSpinnerOn = false;

          const labels: string[] = this.statistics.statistics
            .filter((d: StatisticsPerDay) => d.qrScans.length > 0)
            .map((d: StatisticsPerDay): string => d.day);

          const values: number[] = this.statistics.statistics
            .filter((d: StatisticsPerDay) => d.qrScans.length > 0)
            .map((d: StatisticsPerDay): number => d.qrScans.length);

          this.chartData = {
            labels,
            datasets: [
              {
                label: this.t('qr_scans'),
                data: values,
                backgroundColor: '#006659',
                borderWidth: 1,
              },
            ],
          };
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
