import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const loaderService = inject(LoaderService);

  return next(req)
    .pipe(
      tap((event) => {
        if(event.type === HttpEventType.Response) {
          loaderService.hideGeneeralLoader();
        }
      })
    );
};
