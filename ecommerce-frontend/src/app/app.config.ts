// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { withFetch } from '@angular/common/http';
import { credentialsInterceptor } from './services/credentials.interceptor';

export const environment = {
  apiBase: 'http://localhost:8080'   // backend address
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([credentialsInterceptor])),
  ],
};
