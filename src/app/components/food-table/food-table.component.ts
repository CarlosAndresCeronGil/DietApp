import { Component, Signal, WritableSignal } from '@angular/core';
import { DietService } from '../../services/diet.service';
import { FormBuilder } from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import { ActivatedRoute, Data } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ResolverMacrosAndFoodListResponse } from '../../models/resolvers.interface';
import { FoodItem, FoodResponse } from '../../models/food-data.interface';
import { FoodItemComponent } from '../food-item/food-item.component';

@Component({
  selector: 'app-food-table',
  imports: [
    FoodItemComponent,
    MatCardModule,
    MatGridListModule,
    SharedTableComponent
  ],
  templateUrl: './food-table.component.html',
  styleUrl: './food-table.component.scss'
})
export class FoodTableComponent {

  macrosAndFoodListResolverResponse!: Signal<ResolverMacrosAndFoodListResponse|Data|undefined>;

  myProteinsGoal: Signal<number>;
  myCarbsGoal: Signal<number>;
  myFatsGoal: Signal<number>;

  currentProteinIntake: Signal<number>;
  currentCarbsIntake: Signal<number>;
  currentFatsIntake: Signal<number>;

  foodDataSignal!: Signal<FoodResponse | undefined>;
  foodItemsList!: WritableSignal<FoodItem[]>;

  constructor(
    public dietService: DietService,
    public formBuilder: FormBuilder,
    private _activatedRouter: ActivatedRoute,
  ) {
    this.macrosAndFoodListResolverResponse = toSignal<ResolverMacrosAndFoodListResponse|Data>(this._activatedRouter.data);
    this.myProteinsGoal = this.dietService.myProteinsGoal;
    this.myCarbsGoal = this.dietService.myeCarbsGoal;
    this.myFatsGoal = this.dietService.myFatsGoal;

    this.currentProteinIntake = this.dietService.currentProteinIntake;
    this.currentCarbsIntake = this.dietService.currentCarbsIntake;
    this.currentFatsIntake = this.dietService.currentFatsIntake;

    this.foodDataSignal = toSignal<FoodResponse | undefined>(this.dietService.selectedFoodList$);
    // this.dietService.selectedFoodList$.pipe(takeUntilDestroyed()).subscribe((data) => {
    //   console.log(data);
    // });

    this.foodItemsList = this.dietService.myFoodItemsList;

  }

  updateTable(e: any) {
    this.dietService.onSelectedFoodListChange(e.per_page, e.page);
  }

  updateNameFiltered(e: any) {
    this.dietService.onSelectedFoodListChange(5, 1, e);
  }

  handleAddFoodItem(item: FoodItem) {
    console.log(item);
    this.dietService.addItemToFoodItemList(item);
  }

}
