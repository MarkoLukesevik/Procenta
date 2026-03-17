import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-about-us-page',
  imports: [],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.scss',
})
export class AboutUsPageComponent {
  private languageService: LanguageService = inject(LanguageService);

  public t(key: string): string {
    return this.languageService.translate(key);
  }
}
