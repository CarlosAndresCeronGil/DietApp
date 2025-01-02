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
import { DietService } from '../../services/diet.service';
import { GoalsInfo } from '../../models/to-pdf.interface';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-user-info-form',
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatExpansionModule,
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
    private _dietService: DietService
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
    const goalsInfo: GoalsInfo = {
      goal: this.userForm.value.goal,
      weight: this.userForm.value.weight,
      activity_level: this.userForm.value.activity_level,
      age: this.userForm.value.age
    };
    this._dietService.updateGoalsInfo(goalsInfo);
  }
}
