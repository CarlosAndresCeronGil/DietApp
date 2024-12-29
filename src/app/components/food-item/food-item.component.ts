import { AfterViewInit, Component, computed, DestroyRef, ElementRef, input, signal, viewChild } from '@angular/core';
import { FoodItem } from '../../models/food-data.interface';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { DietService } from '../../services/diet.service';
import { debounceTime, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'app-food-item',
  imports: [
    MatCardModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './food-item.component.html',
  styleUrl: './food-item.component.scss'
})
export class FoodItemComponent implements AfterViewInit {
  inputAmmountOfFood = viewChild.required<ElementRef>('inputAmountOfFood');

  foodItem = input.required<FoodItem>();

  constructor(
    private _dietService: DietService,
    private _destroyRef: DestroyRef
  ) {}

  ngAfterViewInit(): void {
    fromEvent(this.inputAmmountOfFood().nativeElement, 'keyup')
    .pipe(
      debounceTime(1000),
      takeUntilDestroyed(this._destroyRef)
    )
    .subscribe((ammountOfFood: any) => {
      const currentAmmountOfFood = +ammountOfFood.target.value;

      this._dietService
      .addMacrosToCurrentIntake(+currentAmmountOfFood, this.foodItem());
    });
  }

  handleDeleteFooItem(foodItem: FoodItem) {
    this._dietService.deleteFoodItem(foodItem);
  }

}
