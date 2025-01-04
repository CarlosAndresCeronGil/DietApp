import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { errorText, ErrorTextFunction } from '../../shared/utils/form-utils';
import { Router } from '@angular/router';
import { DietService } from '../../services/diet.service';
import { GoalsInfo } from '../../models/to-pdf.interface';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { YoutubeModalComponent } from '../youtube-modal/youtube-modal.component';
import { environment } from '../../../environments/environments';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-info-form',
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatExpansionModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-info-form.component.html',
  styleUrl: './user-info-form.component.scss',
})
export class UserInfoFormComponent {
  userForm!: FormGroup;
  errorText: ErrorTextFunction;

  constructor(
    private _builder: FormBuilder,
    private _router: Router,
    private _dietService: DietService,
    private _dialog: MatDialog
  ) {
    this.userForm = this._builder.group({
      gender: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(1)]],
      height: ['', [Validators.required, Validators.min(1)]],
      age: ['', [Validators.required, Validators.min(1)]],
      activity_level: ['', Validators.required],
      goal: ['', Validators.required],
    });
    this.errorText = errorText(this.userForm);
  }

  openVideo() {
    this._dialog.open(YoutubeModalComponent, {
      data: {
        videoId: environment.youtube_form_video_id
      },
      enterAnimationDuration: 200,
    });
  }

  submitForm() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this._router.navigate(['food-table'], { queryParams: this.userForm.value });
    const goalsInfo: GoalsInfo = {
      goal: this.userForm.value.goal,
      weight: this.userForm.value.weight,
      activity_level: this.userForm.value.activity_level,
      age: this.userForm.value.age
    };
    this._dietService.updateGoalsInfo(goalsInfo);
  }
}
