import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-statistics-page',
  imports: [],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss',
})
export class StatisticsPageComponent {
  private toastService: ToastrService = inject(ToastrService);
  private languageService: LanguageService = inject(LanguageService);

  public t(key: string): string {
    return this.languageService.translate(key);
  }
}
