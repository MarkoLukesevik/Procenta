import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private languageService: LanguageService = inject(LanguageService);

  public t(key: string): string {
    return this.languageService.translate(key);
  }
}
