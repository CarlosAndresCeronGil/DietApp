import { Component } from '@angular/core';
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

@Component({
  selector: 'app-user-info-form',
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
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
  ) {
    this.userForm = this._builder.group({
      gender: ['male', Validators.required],
      weight: ['66', [Validators.required, Validators.min(1)]],
      height: ['172', [Validators.required, Validators.min(1)]],
      age: ['26', [Validators.required, Validators.min(1)]],
      activity_level: ['active', Validators.required],
      goal: ['gain', Validators.required],
    });
    this.errorText = errorText(this.userForm);
  }

  submitForm() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this._router.navigate(['food-table'], { queryParams: this.userForm.value });
  }
}
