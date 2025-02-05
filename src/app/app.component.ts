import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoaderService } from './services/loader.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatIconModule,
    MatProgressBarModule,
    MatToolbarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DietApp';

  constructor(
    private _router: Router,
    public loaderService: LoaderService,
    public iconRegistry: MatIconRegistry,
    public domSanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
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

      if (isPlatformBrowser(this.platformId)) {
        iconRegistry.addSvgIcon(
          'instagram',
          this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/instagram_icon.svg')
        );
      }
  }

  handleMainTitleClicked() {
    this._router.navigate(['']);
  }

}
