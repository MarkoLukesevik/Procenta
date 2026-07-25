import { Component, inject } from '@angular/core';

import { LoadingService } from '../../../services/loading.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-warmup-banner',
  imports: [],
  templateUrl: './warmup-banner.component.html',
  styleUrl: './warmup-banner.component.scss',
})
export class WarmupBannerComponent {
  public loadingService: LoadingService = inject(LoadingService);
  private languageService: LanguageService = inject(LanguageService);

  public t(key: string): string {
    return this.languageService.translate(key);
  }
}
