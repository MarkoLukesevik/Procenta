import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { MapComponent } from './components/map/map.component';

@Component({
  selector: 'app-about-us-page',
  imports: [MapComponent],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.scss',
})
export class AboutUsPageComponent {
  private languageService: LanguageService = inject(LanguageService);

  public t(key: string): string {
    return this.languageService.translate(key);
  }
}
