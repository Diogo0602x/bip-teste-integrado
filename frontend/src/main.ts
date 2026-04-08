import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { httpCacheInterceptor } from './app/core/interceptors/http-cache.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([httpCacheInterceptor])),
    provideAnimationsAsync(),
    provideRouter(appRoutes, withPreloading(PreloadAllModules))
  ]
}).catch((err) => console.error(err));
