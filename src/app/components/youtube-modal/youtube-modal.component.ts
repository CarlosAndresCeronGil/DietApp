import { Component, HostListener, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { YouTubePlayer } from '@angular/youtube-player'
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-youtube-modal',
  imports: [
    YouTubePlayer
  ],
  templateUrl: './youtube-modal.component.html',
  styleUrl: './youtube-modal.component.scss'
})
export class YoutubeModalComponent {
  videoWidth = signal<number>(560);

  readonly data = inject(MAT_DIALOG_DATA);
  constructor(
    private diaglogRef: MatDialogRef<YoutubeModalComponent>,
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.videoWidth.set(event.target.innerWidth > 560 ? 560 : event.target.innerWidth * .8);
  }

  onClose() {
    this.diaglogRef.close();
  }

}
