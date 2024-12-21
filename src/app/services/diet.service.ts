import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environments';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { CalculateDietResponse } from '../models/calculate-diet.interface';
import { FoodItem, FoodResponse } from '../models/food-data.interface';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class DietService {
  PERMISSIBLE_INTAKE_VALUE = 50;

  myFoodItemsList = signal<FoodItem[]>([]);
  myFoodItemListWithValues = signal<any[]>([]);

  currentProteinIntake = signal<number>(0);
  currentCarbsIntake = signal<number>(0);
  currentFatsIntake = signal<number>(0);

  myProteinsGoal = signal<number>(0);
  myeCarbsGoal = signal<number>(0);
  myFatsGoal = signal<number>(0);

  proteinColor = computed(() => {
    if (
      this.currentProteinIntake() - this.myProteinsGoal() < this.PERMISSIBLE_INTAKE_VALUE ||
      this.myProteinsGoal() - this.currentProteinIntake() < this.PERMISSIBLE_INTAKE_VALUE
    ) {
      return 'green';
    }
    return 'red';
  });
  carbsColor = computed(() => {
    if (
      this.currentCarbsIntake() - this.myeCarbsGoal() < this.PERMISSIBLE_INTAKE_VALUE ||
      this.myeCarbsGoal() - this.currentCarbsIntake() < this.PERMISSIBLE_INTAKE_VALUE
    ) {
      return 'green';
    }
    return 'red';
  });
  fatsColor = computed(() => {
    if (
      this.currentFatsIntake() - this.myFatsGoal() < this.PERMISSIBLE_INTAKE_VALUE ||
      this.myFatsGoal() - this.currentFatsIntake() < this.PERMISSIBLE_INTAKE_VALUE
    ) {
      return 'green';
    }
    return 'red';
  });

  isLoadingFoodData = computed(() => this._loaderService.tableLoader);

  private _userSelectedFoodList = new BehaviorSubject<{per_page: number, page: number, name: string}>({per_page: 5, page: 1, name: ''});
  userSelectedFoodListAction$ = this._userSelectedFoodList.asObservable();

  selectedFoodList$: Observable<FoodResponse> = this.userSelectedFoodListAction$.pipe(
    switchMap(({per_page, page, name}) => {
      this._loaderService.showTableLoader();
      return this.getFoodList(per_page, page, name)
        .pipe(
          tap(() => {
            this._loaderService.hideTableLoader();
          })
        );
    })
  );

  constructor
  (private _http: HttpClient,
  private _loaderService: LoaderService,
  ) {
  }

  calculateDiet(data: any): Observable<CalculateDietResponse> {
    return this._http.post<CalculateDietResponse>(
      environment.api_url + '/calculate-diet',
      data
    )
    .pipe(
      tap((data) => {
        this.myProteinsGoal.set(data.data.protein);
        this.myeCarbsGoal.set(data.data.carbs);
        this.myFatsGoal.set(data.data.fat);
      })
    );
  }

  onSelectedFoodListChange(per_page: number, page: number, name: string = '') {
    this._userSelectedFoodList.next({per_page, page, name});
  }

  getFoodList(per_page: number = 10, page: number = 1, name: string = ''): Observable<FoodResponse> {
    return this._http.get<FoodResponse>(
      environment.api_url + `/get-food?per_page=${per_page}&page=${page}&name=${name}`
    );
  }

  addItemToFoodItemList(item: FoodItem) {
    this.myFoodItemsList.set([...this.myFoodItemsList(), item]);
  }

  addMacrosToCurrentIntake(ammount: number, foodName: string, protein: number, carbs: number, fat: number, unit: string) {
    const unitToBeDivided = unit === 'gr' ? 100 : 1;
    const existFoodInListWithValues = this.myFoodItemListWithValues().find((item) => item.name === foodName);

    let calculatedProtein = Math.floor((protein / unitToBeDivided) * ammount);;
    let calculatedCarbs = Math.floor((carbs / unitToBeDivided) * ammount);
    let calculatedFats = Math.floor((fat / unitToBeDivided) * ammount);

    if(existFoodInListWithValues == undefined) {
      this.myFoodItemListWithValues
      .set([
        ...this.myFoodItemListWithValues(),
        { name: foodName, protein: calculatedProtein, carbs: calculatedCarbs, fat: calculatedFats }
      ]);
    } else {
      const indexOfEditedFood = this.myFoodItemListWithValues().findIndex((item) => item.name === foodName);
      this.myFoodItemListWithValues.set([
        ...this.myFoodItemListWithValues().slice(0, indexOfEditedFood),
        { name: foodName, protein: calculatedProtein, carbs: calculatedCarbs, fat: calculatedFats },
        ...this.myFoodItemListWithValues().slice(indexOfEditedFood + 1)
      ])
    }
    const totalProteinIntake = this.myFoodItemListWithValues().reduce((acc, item) => acc + item.protein, 0);
    const totalCarbsIntake = this.myFoodItemListWithValues().reduce((acc, item) => acc + item.carbs, 0);
    const totalFatsIntake = this.myFoodItemListWithValues().reduce((acc, item) => acc + item.fat, 0);
    this.currentProteinIntake.set(totalProteinIntake);
    this.currentCarbsIntake.set(totalCarbsIntake);
    this.currentFatsIntake.set(totalFatsIntake);
  }
}
