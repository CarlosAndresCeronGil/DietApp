import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoaderService } from './services/loader.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressBarModule, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DietApp';

  constructor(
    private _router: Router,
    public loaderService: LoaderService
  ) {
    this._router.events
      .pipe(
        filter((e) => e instanceof NavigationStart || e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError),
        tap((e) => {
          if (e instanceof NavigationStart) {
            this.loaderService.showGeneralLoader();
          } else {
            this.loaderService.hideGeneeralLoader();
          }
        }),
        takeUntilDestroyed()
      ).subscribe();
  }

  handleMainTitleClicked() {
    this._router.navigate(['']);
  }

}
