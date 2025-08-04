import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { LanguageService } from './app/services/language.service';
import { APP_INITIALIZER } from '@angular/core';

export function preloadTranslationsFactory(langService: LanguageService) {
  return () => langService.loadInitialLanguage();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LanguageService,
    {
      provide: APP_INITIALIZER,
      useFactory: preloadTranslationsFactory,
      deps: [LanguageService],
      multi: true,
    },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(),
  ],
});
