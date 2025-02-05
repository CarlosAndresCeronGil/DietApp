import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoFormComponent } from './user-info-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClientTesting }
    from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { provideRouter, Router } from '@angular/router';
import { FoodTableComponent } from '../food-table/food-table.component';

describe('UserInfoFormComponent', () => {
  let component: UserInfoFormComponent;
  let fixture: ComponentFixture<UserInfoFormComponent>;
  let h2: HTMLElement;
  let matCard: DebugElement;
  let form: HTMLElement;
  let genderSelect: DebugElement;
  let weightInput: DebugElement;
  let heightInput: DebugElement;
  let ageInput: DebugElement;
  let activityLevelSelect: DebugElement;
  let goalSelect: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserInfoFormComponent,
        MatCardModule,
        MatSelectModule,
        ReactiveFormsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
        provideRouter([
          { path: "food-table", component: FoodTableComponent }
        ])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    h2 = fixture.nativeElement.querySelector('h2');
    matCard = fixture.debugElement.query(By.css('mat-card'));
    form = fixture.nativeElement.querySelector('form');
    genderSelect = fixture.debugElement.query(By.css('mat-select[formControlName="gender"]'));
    weightInput = fixture.debugElement.query(By.css('input[formControlName="weight"]'));
    heightInput = fixture.debugElement.query(By.css('input[formControlName="height"]'));
    ageInput = fixture.debugElement.query(By.css('input[formControlName="age"]'));
    activityLevelSelect = fixture.debugElement.query(By.css('mat-select[formControlName="activity_level"]'));
    goalSelect = fixture.debugElement.query(By.css('mat-select[formControlName="goal"]'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the main message of the form', () => {
    expect(h2.textContent).toBe('Empecemos por conocer tus datos básicos para calcular macronutrientes.');
  });

  it('should render the main card of the form', () => {
    expect(matCard).toBeTruthy();
  });

  it('should render the form', () => {
    expect(form).toBeTruthy();
  })

  it('should render all the elements of the form', () => {
    expect(genderSelect).toBeTruthy();
    expect(weightInput).toBeTruthy();
    expect(heightInput).toBeTruthy();
    expect(ageInput).toBeTruthy();
    expect(activityLevelSelect).toBeTruthy();
    expect(goalSelect).toBeTruthy();
  });

  it('should update form control when gender is selected', () => {
    expect(component.userForm.get('gender')?.value).toBeFalsy();

    genderSelect.nativeElement.click();
    fixture.detectChanges();

    const overlayOptions = document.querySelectorAll('mat-option');
    expect(overlayOptions).toBeTruthy();
    expect(overlayOptions.length).toBeGreaterThan(0);

    const maleOption = Array.from(overlayOptions).find(option => option.getAttribute('value') === 'male');
    expect(maleOption).toBeTruthy();

    maleOption?.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.userForm.get('gender')?.value).toBe('male');
  });

  it('should update form control when weight is typed', () => {
    weightInput.nativeElement.value = 67;

    weightInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(weightInput?.nativeElement.value).toBe('67');
  });

  it('should log required field error when input touched', () => {
    const heightControl = component.userForm.get('height');
    expect(heightControl).toBeTruthy();

    heightControl?.markAsTouched();
    heightControl?.setValue('');
    component.userForm.updateValueAndValidity();
    fixture.detectChanges();

    const errorElements = fixture.debugElement.queryAll(By.css('mat-error'));

    const errorText = errorElements[0].nativeNode.textContent;
    expect(errorText).toBe('Campo requerido');
  });

  it('should redirect to food-table when form gets submitted', async () => {
    component.userForm.get('gender')?.setValue('male');
    component.userForm.get('weight')?.setValue('male');
    component.userForm.get('height')?.setValue('172');
    component.userForm.get('age')?.setValue('27');
    component.userForm.get('activity_level')?.setValue('active');
    component.userForm.get('goal')?.setValue('maintenance');
    component.submitForm();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toEqual('/food-table?gender=male&weight=male&height=172&age=27&activity_level=active&goal=maintenance');
  });
});
