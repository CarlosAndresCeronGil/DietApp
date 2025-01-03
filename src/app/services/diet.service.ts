import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environments';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { CalculateDietResponse } from '../models/calculate-diet.interface';
import { FoodItem, FoodResponse } from '../models/food-data.interface';
import { LoaderService } from './loader.service';
import Swal from 'sweetalert2';
import { GoalsInfo, ToPdf, ToPdfResponse } from '../models/to-pdf.interface';

@Injectable({
  providedIn: 'root',
})
export class DietService {
  PERMISSIBLE_INTAKE_VALUE = 20;

  myFoodItemsList = signal<FoodItem[]>([]);
  myFoodItemListWithValues = signal<FoodItem[]>([]);

  currentProteinIntake = signal<number>(0);
  currentCarbsIntake = signal<number>(0);
  currentFatsIntake = signal<number>(0);

  myProteinsGoal = signal<number>(0);
  myeCarbsGoal = signal<number>(0);
  myFatsGoal = signal<number>(0);

  goalsInfo = signal<GoalsInfo|undefined>(undefined);

  proteinColor = computed(() => {
    if (
      Math.abs(this.currentProteinIntake() - this.myProteinsGoal()) < this.PERMISSIBLE_INTAKE_VALUE &&
      this.currentProteinIntake() !== 0
    ) {
      this.showSuccessIntakeMessage('proteinas');
      return 'green';
    }
    return 'red';
  });
  carbsColor = computed(() => {
    if (
      Math.abs(this.currentCarbsIntake() - this.myeCarbsGoal()) < this.PERMISSIBLE_INTAKE_VALUE &&
      this.currentCarbsIntake() !== 0
    ) {
      this.showSuccessIntakeMessage('carbohidratos');
      return 'green';
    }
    return 'red';
  });
  fatsColor = computed(() => {
    if (
      Math.abs(this.currentFatsIntake() - this.myFatsGoal()) < this.PERMISSIBLE_INTAKE_VALUE &&
      this.currentFatsIntake() !== 0
    ) {
      this.showSuccessIntakeMessage('grasas');
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

  constructor(
    private _http: HttpClient,
    private _loaderService: LoaderService,
  ) {}

  updateGoalsInfo(data: GoalsInfo) {
    this.goalsInfo.set(data);
  }

  showSuccessIntakeMessage(name: string) {
    Swal.fire({
      icon: 'success',
      title: 'Genial!',
      text: `Haz comletado tu consumo de ${name}`,
      position: 'bottom-start',
      toast: true,
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.style.marginBottom = '10px';
      }
    });
  }

  calculateDiet(data: any): Observable<CalculateDietResponse> {
    return this._http.post<CalculateDietResponse>(
      environment.api_url + '/calculate-diet',
      data
    )
    .pipe(
      tap((data) => {
        this.myProteinsGoal.set(data.data.macros.protein);
        this.myeCarbsGoal.set(data.data.macros.carbs);
        this.myFatsGoal.set(data.data.macros.fat);
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

  addMacrosToCurrentIntake(ammount: number, foodItem: FoodItem) {
    const unitToBeDivided = foodItem.unit === 'gr' ? 100 : 1;
    const existFoodInListWithValues = this.myFoodItemListWithValues().find((item) => item.id === foodItem.id);

    let calculatedProtein = Math.floor((+foodItem.protein / unitToBeDivided) * ammount);;
    let calculatedCarbs = Math.floor((+foodItem.carbs / unitToBeDivided) * ammount);
    let calculatedFats = Math.floor((+foodItem.fat / unitToBeDivided) * ammount);

    const updatedFoodItem = {
      ...foodItem,
      quantity: ammount.toString(),
      protein: calculatedProtein.toString(),
      carbs: calculatedCarbs.toString(),
      fat: calculatedFats.toString()
    };

    if(existFoodInListWithValues == undefined) {
      this.myFoodItemListWithValues
      .set([
        ...this.myFoodItemListWithValues(),
        updatedFoodItem
      ]);
    } else {
      const indexOfEditedFood = this.myFoodItemListWithValues().findIndex((item) => item.id === foodItem.id);
      this.myFoodItemListWithValues.set([
        ...this.myFoodItemListWithValues().slice(0, indexOfEditedFood),
        updatedFoodItem,
        ...this.myFoodItemListWithValues().slice(indexOfEditedFood + 1)
      ])
    }
    const totalProteinIntake = this.myFoodItemListWithValues().reduce((acc, item) => acc + +item.protein, 0);
    const totalCarbsIntake = this.myFoodItemListWithValues().reduce((acc, item) => acc + +item.carbs, 0);
    const totalFatsIntake = this.myFoodItemListWithValues().reduce((acc, item) => acc + +item.fat, 0);
    this.currentProteinIntake.set(totalProteinIntake);
    this.currentCarbsIntake.set(totalCarbsIntake);
    this.currentFatsIntake.set(totalFatsIntake);
  }

  deleteFoodItem(foodItem: FoodItem) {
    const indexOfDeletedFood = this.myFoodItemsList().findIndex((item) => item.id === foodItem.id);
    this.myFoodItemsList.set([
      ...this.myFoodItemsList().slice(0, indexOfDeletedFood),
      ...this.myFoodItemsList().slice(indexOfDeletedFood + 1)
    ]);
    const existInFoodListWithValues = this.myFoodItemListWithValues().find((item) => item.id === foodItem.id);
    if(existInFoodListWithValues) {
      const indexOfDeletedFoodWithValues = this.myFoodItemListWithValues().findIndex((item) => item.id === foodItem.id);
      const totalProteinIntake = this.currentProteinIntake() - +this.myFoodItemListWithValues()[indexOfDeletedFoodWithValues].protein;
      const totalCarbsIntake = this.currentCarbsIntake() - +this.myFoodItemListWithValues()[indexOfDeletedFoodWithValues].carbs;
      const totalFatsIntake = this.currentFatsIntake() - +this.myFoodItemListWithValues()[indexOfDeletedFoodWithValues].fat;

      this.myFoodItemListWithValues.set([
        ...this.myFoodItemListWithValues().slice(0, indexOfDeletedFoodWithValues),
        ...this.myFoodItemListWithValues().slice(indexOfDeletedFoodWithValues + 1)
      ]);

      this.currentProteinIntake.set(totalProteinIntake);
      this.currentCarbsIntake.set(totalCarbsIntake);
      this.currentFatsIntake.set(totalFatsIntake);
    }
  }

  cleanLists() {
    this.myFoodItemsList.set([]);
    this.myFoodItemListWithValues.set([]);
    this.currentProteinIntake.set(0);
    this.currentCarbsIntake.set(0);
    this.currentFatsIntake.set(0);
  }

  printToPdf(): Observable<ToPdfResponse> {
    const data: ToPdf = {
      foods: this.myFoodItemListWithValues(),
      goal: this.goalsInfo()!.goal,
      weight: this.goalsInfo()!.weight,
      activity_level: this.goalsInfo()!.activity_level,
      age: this.goalsInfo()!.age
    };
    return this._http.post<ToPdfResponse>(environment.api_url + '/generate-pdf', data);
  }
}
