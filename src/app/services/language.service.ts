import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Lang = 'en' | 'mk';
type TranslationMap = Record<string, string>;

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLang: Lang = 'en';
  private translations: TranslationMap = {};

  private langChangeSubject = new BehaviorSubject<Lang>(this.currentLang);

  async loadInitialLanguage() {
    const savedLang = localStorage.getItem('lang') as Lang | null;
    this.currentLang =
      savedLang === 'mk' || savedLang === 'en' ? savedLang : 'en';
    this.translations = await this.loadTranslations(this.currentLang);
    this.langChangeSubject.next(this.currentLang);
  }

  public async setLang(lang: Lang): Promise<void> {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    this.translations = await this.loadTranslations(lang);
    this.langChangeSubject.next(lang);
  }

  public getCurrentLang(): Lang {
    return this.currentLang;
  }

  public translate(key: string): string {
    return this.translations[key] || key;
  }

  private async loadTranslations(lang: Lang): Promise<TranslationMap> {
    switch (lang) {
      case 'en':
        return (await import('../localization/en')).default;
      case 'mk':
        return (await import('../localization/mk')).default;
      default:
        return {};
    }
  }
}
